import { setupTestProvider } from '@fuel-ts/providers/test-utils';
import type { Provider } from 'fuels';
import { BaseAssetId, Predicate } from 'fuels';

import predicateBytesMainArgsStruct from '../../fixtures/forc-projects/predicate-main-args-struct';
import predicateAbiMainArgsStruct from '../../fixtures/forc-projects/predicate-main-args-struct/out/debug/predicate-main-args-struct-abi.json';
import type { Validation } from '../types/predicate';

import { fundPredicate, setupWallets } from './utils/predicate';

describe('Predicate', () => {
  describe('Invalidations', () => {
    const validation: Validation = {
      has_account: true,
      total_complete: 100,
    };

    const setupPredicate = async (provider: Provider) => {
      const [wallet, receiver] = await setupWallets(provider);
      const amountToPredicate = 100;
      const chainId = await wallet.provider.getChainId();
      const predicate = new Predicate<[Validation]>(
        predicateBytesMainArgsStruct,
        chainId,
        provider,
        predicateAbiMainArgsStruct
      );

      const predicateBalance = await fundPredicate(wallet, predicate, amountToPredicate);

      return {
        predicate,
        predicateBalance,
        receiver,
      };
    };

    it('throws if sender does not have enough resources for tx and gas', async () => {
      using provider = await setupTestProvider();
      const { predicate, predicateBalance, receiver } = await setupPredicate(provider);
      await expect(
        predicate.setData(validation).transfer(receiver.address, predicateBalance)
      ).rejects.toThrow(/not enough coins to fit the target/i);
    });

    it('throws if the passed gas limit is too low', async () => {
      using provider = await setupTestProvider();
      const { predicate, receiver } = await setupPredicate(provider);

      // TODO: When gas is to low the return error is Invalid transaction, once is fixed on the
      // fuel-client we should change with the proper error message
      await expect(
        predicate.setData(validation).transfer(receiver.address, 50, BaseAssetId, {
          gasLimit: 1,
        })
      ).rejects.toThrow(/Invalid transaction/i);
    });
  });
});
