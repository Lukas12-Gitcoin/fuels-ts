import { Address, BN, ContractFactory, BaseAssetId, Wallet } from 'fuels';

import { SnippetProjectEnum, getSnippetProjectArtifacts } from '../../../projects';
import { getTestWallet } from '../../utils';

describe(__filename, () => {
  it('should successfully transfer asset to another wallet', async () => {
    await using senderWallet = await getTestWallet();

    // #region transferring-assets-1
    // #context import { Wallet, BN, BaseAssetId } from 'fuels';

    // #context const senderWallet = Wallet.fromPrivateKey('...');
    const destinationWallet = Wallet.generate({
      provider: senderWallet.provider,
    });
    const amountToTransfer = 500;
    const assetId = BaseAssetId;

    const response = await senderWallet.transfer(
      destinationWallet.address,
      amountToTransfer,
      assetId
    );

    await response.wait();

    // Retrieve balances
    const receiverBalance = await destinationWallet.getBalance(assetId);

    // Validate new balance
    expect(new BN(receiverBalance).toNumber()).toEqual(amountToTransfer);
    // #endregion transferring-assets-1
  });

  it('should successfully transfer asset to a deployed contract', async () => {
    await using senderWallet = await getTestWallet();

    const { abiContents, binHexlified } = getSnippetProjectArtifacts(SnippetProjectEnum.COUNTER);

    const factory = new ContractFactory(binHexlified, abiContents, senderWallet);

    const deployedContract = await factory.deployContract();
    const contractId = Address.fromAddressOrString(deployedContract.id);
    // #region transferring-assets-2
    // #context import { Wallet, BN, BaseAssetId } from 'fuels';

    // #context const senderWallet = Wallet.fromPrivateKey('...');

    const amountToTransfer = 400;
    const assetId = BaseAssetId;
    // #context const contractId = Address.fromAddressOrString('0x123...');

    const contractBalance = await deployedContract.getBalance(assetId);

    const tx = await senderWallet.transferToContract(contractId, amountToTransfer, assetId);
    expect(new BN(contractBalance).toNumber()).toBe(0);

    await tx.waitForResult();

    expect(new BN(await deployedContract.getBalance(assetId)).toNumber()).toBe(amountToTransfer);
    // #endregion transferring-assets-2
  });
});
