import { safeExec } from '@fuel-ts/errors/test-utils';

import Provider from '../../provider';

import { setupTestProvider } from './setup-test-provider';

function loggy(id: string): Disposable {
  // @ts-expect-error this is a polyfill (see https://devblogs.microsoft.com/typescript/announcing-typescript-5-2/#using-declarations-and-explicit-resource-management)
  Symbol.dispose ??= Symbol('Symbol.dispose');

  console.log(`Creating ${id}`);

  return {
    [Symbol.dispose]() {
      console.log(`Disposing ${id}`);
    },
  };
}

function func() {
  using a = loggy('a');
  using b = loggy('b');
  // eslint-disable-next-line no-lone-blocks
  {
    using c = loggy('c');
    using d = loggy('d');
  }
  using e = loggy('e');
  return;

  // Unreachable.
  // Never created, never disposed.
  using f = loggy('f');
}

describe('launchTestProvider', () => {
  it('kills the node after going out of scope', async () => {
    func();
    let url = '';
    // eslint-disable-next-line no-lone-blocks
    {
      using p = await setupTestProvider();
      url = p.url;
      await p.getChain();
    }

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
