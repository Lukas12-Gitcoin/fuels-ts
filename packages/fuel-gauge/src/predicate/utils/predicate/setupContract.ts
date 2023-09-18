import type { BytesLike } from '@ethersproject/bytes';
import { generateTestWallet } from '@fuel-ts/wallet/test-utils';
import { BaseAssetId, ContractFactory } from 'fuels';
import type { Interface, JsonAbi, Contract, WalletUnlocked, Provider } from 'fuels';

let walletInstance: WalletUnlocked;
let contractInstance: Contract;

export type SetupConfig = {
  contractBytecode: BytesLike;
  abi: JsonAbi | Interface;
  cache?: boolean;
};

const deployContract = async (factory: ContractFactory, useCache: boolean = true) => {
  if (contractInstance && useCache) return contractInstance;
  contractInstance = await factory.deployContract();
  return contractInstance;
};

const createWallet = async (provider: Provider) => {
  if (walletInstance) return walletInstance;
  walletInstance = await generateTestWallet(provider, [
    [5_000_000, BaseAssetId],
    [5_000_000, '0x0101010101010101010101010101010101010101010101010101010101010101'],
  ]);
  return walletInstance;
};

export const setup = async (provider: Provider, { contractBytecode, abi, cache }: SetupConfig) => {
  // Create wallet
  const wallet = await createWallet(provider);
  const factory = new ContractFactory(contractBytecode, abi, wallet);
  const contract = await deployContract(factory, cache);
  return contract;
};

export const setupContractWithConfig =
  (defaultConfig: SetupConfig) => async (provider: Provider, config?: Partial<SetupConfig>) =>
    setup(provider, {
      contractBytecode: defaultConfig.contractBytecode,
      abi: defaultConfig.abi,
      ...config,
    });
