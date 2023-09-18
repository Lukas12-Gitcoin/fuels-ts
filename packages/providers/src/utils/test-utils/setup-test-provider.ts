import { launchNode } from '@fuel-ts/utils/test-utils';

import type { ProviderOptions } from '../../provider';
import Provider from '../../provider';
import { sleep } from '../sleep';

export async function setupTestProvider<Dispose extends boolean = true>(
  providerOptions?: ProviderOptions,
  runCleanup?: Dispose
): Promise<
  Dispose extends true
    ? Provider & AsyncDisposable & Disposable
    : { provider: Provider; cleanup: () => void }
> {
  // @ts-expect-error this is a polyfill (see https://devblogs.microsoft.com/typescript/announcing-typescript-5-2/#using-declarations-and-explicit-resource-management)
  Symbol.dispose ??= Symbol('Symbol.dispose');
  // @ts-expect-error this is a polyfill (see https://devblogs.microsoft.com/typescript/announcing-typescript-5-2/#using-declarations-and-explicit-resource-management)
  Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose');

  const { cleanup, ip, port } = await launchNode({});
  const provider = await Provider.connect(`http://${ip}:${port}/graphql`, providerOptions);

  const dispose = runCleanup ?? true;
  // @ts-expect-error TODO: fix later
  return dispose
    ? Object.assign(provider, {
        [Symbol.dispose]: () => {
          cleanup();
        },
        async [Symbol.asyncDispose]() {
          cleanup();
          await sleep(5000);
        },
      })
    : {
        provider,
        cleanup,
      };
}
