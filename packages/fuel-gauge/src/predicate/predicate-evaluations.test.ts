import { setupTestProvider } from '@fuel-ts/providers/test-utils';
import { Predicate } from 'fuels';

import predicateBytesFalse from '../../fixtures/forc-projects/predicate-false';
import predicateBytesTrue from '../../fixtures/forc-projects/predicate-true';

import { setupWallets, assertBalances, fundPredicate } from './utils/predicate';

describe('Predicate', () => {
  describe('Evaluations', () => {
    it('calls a no argument predicate and returns true', async () => {
      await using provider = await setupTestProvider();
      const [wallet, receiver] = await setupWallets(provider);
      const chainId = await wallet.provider.getChainId();
      const amountToPredicate = 100;
      const amountToReceiver = 50;
      const initialReceiverBalance = await receiver.getBalance();

      const predicate = new Predicate(predicateBytesTrue, chainId, provider);

      const initialPredicateBalance = await fundPredicate(wallet, predicate, amountToPredicate);

      const tx = await predicate.transfer(receiver.address, amountToReceiver);
      await tx.waitForResult();

      await assertBalances(
        predicate,
        receiver,
        initialPredicateBalance,
        initialReceiverBalance,
        amountToPredicate,
        amountToReceiver
      );
    });

    it('calls a no argument predicate and returns false', async () => {
      await using provider = await setupTestProvider();
      const [wallet, receiver] = await setupWallets(provider);
      const chainId = await wallet.provider.getChainId();

      const amountToPredicate = 100;
      const amountToReceiver = 50;

      const predicate = new Predicate(predicateBytesFalse, chainId, provider);

      await fundPredicate(wallet, predicate, amountToPredicate);

      await expect(predicate.transfer(receiver.address, amountToReceiver)).rejects.toThrow(
        'Invalid transaction'
      );
    });
  });
});
