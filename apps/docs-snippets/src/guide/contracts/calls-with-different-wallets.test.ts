import { Provider, WalletUnlocked } from 'fuels';

import { SnippetProjectEnum } from '../../../projects';
import { createAndDeployContractFromProject } from '../../utils';

describe(__filename, () => {
  it('should successfully update contract instance wallet', async () => {
    using contract = await createAndDeployContractFromProject(SnippetProjectEnum.RETURN_CONTEXT);

    const newWallet = WalletUnlocked.generate({
      provider: contract.provider,
    });

    expect(contract.account?.address).not.toBe(newWallet.address);

    // #region calls-with-different-wallets-1
    contract.account = newWallet;
    // #endregion calls-with-different-wallets-1

    expect(contract.account.address).toBe(newWallet.address);
  });

  it('should successfully update contract instance provider', async () => {
    const contract = await createAndDeployContractFromProject(SnippetProjectEnum.RETURN_CONTEXT);

    const chainInfo = contract.provider.getCachedChainInfo();

    // use the `chainInfo` from the deployed contract's provider to create a new dummy provider
    const newProvider = new Provider('http://provider:9999', chainInfo);

    expect(contract.provider?.url).not.toBe(newProvider.url);

    // #region calls-with-different-wallets-2
    contract.provider = newProvider;
    // #endregion calls-with-different-wallets-2

    expect(contract.provider.url).toBe(newProvider.url);
  });
});
