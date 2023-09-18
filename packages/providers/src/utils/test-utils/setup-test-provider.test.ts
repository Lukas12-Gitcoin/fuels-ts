import { safeExec } from '@fuel-ts/errors/test-utils';

import { sleep } from '..';
import Provider from '../../provider';

import { setupTestProvider } from './setup-test-provider';

describe('launchTestProvider', () => {
  it('kills the node after going out of scope', async () => {
    let url = '';
    // eslint-disable-next-line no-lone-blocks
    {
      using p = await setupTestProvider();
      url = p.url;
      await p.getChain();
    }
    // // Sleep for some time until the process is killed
    await sleep(2500);

    const { error, result } = await safeExec(async () => Provider.connect(url));

    const ipAndPort = url.replace('http://', '').replace('/graphql', '');

    expect(result).toBeUndefined();

    expect(error).toEqual({
      message: `request to ${url} failed, reason: connect ECONNREFUSED ${ipAndPort}`,
      type: 'system',
      errno: 'ECONNREFUSED',
      code: 'ECONNREFUSED',
    });
  });
});
