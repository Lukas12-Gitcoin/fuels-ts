import { ContractFactory, Contract } from 'fuels';

import { SnippetProjectEnum, getSnippetProjectArtifacts } from '../../../projects';
import { getTestWallet } from '../../utils';

describe(__filename, () => {
  const { abiContents: abi, binHexlified: bin } = getSnippetProjectArtifacts(
    SnippetProjectEnum.ECHO_VALUES
  );

  it('should successfully interact with a deployed contract', async () => {
    await using wallet = await getTestWallet();
    const factory = new ContractFactory(bin, abi, wallet);

    const contract = await factory.deployContract();

    const contractId = contract.id;
    // #region managing-deployed-contracts-1
    const deployedContract = new Contract(contractId, abi, wallet);

    const { value } = await deployedContract.functions.echo_u8(10).simulate();

    expect(value).toEqual(10);
    // #endregion managing-deployed-contracts-1
  });

  it('should successfully interact with a deployed contract [hexed contract id]', async () => {
    await using wallet = await getTestWallet();
    const factory = new ContractFactory(bin, abi, wallet);

    const contract = await factory.deployContract();

    const b256 = contract.id.toB256();

    // #region managing-deployed-contracts-2
    // #context const b256 = '0x50007a55ccc29075bc0e9c0ea0524add4a7ed4f91afbe1fdcc661caabfe4a82f';

    const deployedContract = new Contract(b256, abi, wallet);

    const { value } = await deployedContract.functions.echo_u8(50).simulate();

    expect(value).toEqual(50);
    // #endregion managing-deployed-contracts-2
  });
});
