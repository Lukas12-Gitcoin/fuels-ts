import { generateTestWallet } from '@fuel-ts/wallet/test-utils';
import { readFileSync } from 'fs';
import type { Interface, Contract, BytesLike, WalletUnlocked, JsonAbi, Provider } from 'fuels';
import { Script, ContractFactory, BaseAssetId } from 'fuels';
import { join } from 'path';

let contractInstance: Contract;
const deployContract = async (factory: ContractFactory, useCache: boolean = true) => {
  if (contractInstance && useCache) return contractInstance;
  contractInstance = await factory.deployContract();
  return contractInstance;
};

let walletInstance: WalletUnlocked;
const createWallet = async (provider: Provider) => {
  if (walletInstance) return walletInstance;
  walletInstance = await generateTestWallet(provider, [
    [5_000_000, BaseAssetId],
    [5_000_000, '0x0101010101010101010101010101010101010101010101010101010101010101'],
  ]);
  return walletInstance;
};

export type SetupConfig = {
  contractBytecode: BytesLike;
  abi: JsonAbi | Interface;
  cache?: boolean;
};

export const setup = async (provider: Provider, { contractBytecode, abi, cache }: SetupConfig) => {
  // Create wallet
  const wallet = await createWallet(provider);

  const factory = new ContractFactory(contractBytecode, abi, wallet);
  const contract = await deployContract(factory, cache);
  return contract;
};

export const createSetupConfig =
  (defaultConfig: SetupConfig) => async (provider: Provider, config?: Partial<SetupConfig>) =>
    setup(provider, {
      contractBytecode: defaultConfig.contractBytecode,
      abi: defaultConfig.abi,
      ...config,
    });

const getFullPath = <T>(contractName: string, next: (fullPath: string) => T) =>
  next(join(__dirname, `../fixtures/forc-projects/${contractName}/out/debug/${contractName}`));

export const getSetupContract = (
  contractName: string
): ((provider: Provider, config?: Partial<SetupConfig>) => Promise<Contract>) =>
  getFullPath(contractName, (fullPath: string) =>
    createSetupConfig({
      contractBytecode: readFileSync(`${fullPath}.bin`),
      abi: JSON.parse(readFileSync(`${fullPath}-abi.json`, 'utf8')),
    })
  );

export const getScript = <TInput extends unknown[], TOutput>(
  scriptName: string,
  wallet: WalletUnlocked
): Script<TInput, TOutput> =>
  getFullPath(
    scriptName,
    (fullPath: string) =>
      new Script(
        readFileSync(`${fullPath}.bin`),
        JSON.parse(readFileSync(`${fullPath}-abi.json`, 'utf8')),
        wallet
      )
  );
