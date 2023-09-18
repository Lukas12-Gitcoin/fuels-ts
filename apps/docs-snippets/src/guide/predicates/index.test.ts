import { setupTestProvider } from '@fuel-ts/providers/test-utils';
import { Predicate } from 'fuels';

import { SnippetProjectEnum, getSnippetProjectArtifacts } from '../../../projects';

describe(__filename, () => {
  const { abiContents: jsonAbi, binHexlified: binary } = getSnippetProjectArtifacts(
    SnippetProjectEnum.RETURN_TRUE_PREDICATE
  );

  it('should successfully instantiate a predicate', async () => {
    // #region predicate-index-2
    // #context import { Predicate, Provider, FUEL_NETWORK_URL } from 'fuels';

    await using provider = await setupTestProvider();
    const chainId = await provider.getChainId();
    const predicate = new Predicate(binary, chainId, provider, jsonAbi);
    // #endregion predicate-index-2

    expect(predicate).toBeTruthy();
  });
});
