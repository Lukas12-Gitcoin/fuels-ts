import { launchNode } from '@fuel-ts/utils/test-utils';

import type { ProviderOptions } from '../../provider';
import Provider from '../../provider';

export async function setupTestProvider(providerOptions?: ProviderOptions) {
  // @ts-expect-error this is a polyfill
  Symbol.dispose ??= Symbol('Symbol.dispose');
  // @ts-expect-error this is a polyfill
  Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose');

  const { cleanup, ip, port } = await launchNode({});
  const provider = new Provider(`http://${ip}:${port}/graphql`, providerOptions);

  return Object.assign(provider, {
    [Symbol.dispose]: () => {
      cleanup();
    },
  });
}
