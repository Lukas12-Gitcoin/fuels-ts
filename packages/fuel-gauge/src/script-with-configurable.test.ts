import { setupTestProvider } from '@fuel-ts/providers/test-utils';
import { generateTestWallet } from '@fuel-ts/wallet/test-utils';
import { readFileSync } from 'fs';
import type { CoinQuantityLike, WalletUnlocked } from 'fuels';
import { BN, Script, BaseAssetId } from 'fuels';
import { join } from 'path';

import abi from '../fixtures/forc-projects/script-with-configurable/out/debug/script-with-configurable-abi.json';

const bytecode = readFileSync(
  join(
    __dirname,
    '../fixtures/forc-projects/script-with-configurable/out/debug/script-with-configurable.bin'
  )
);

const defaultValues = {
  FEE: 5,
};

const quantities: CoinQuantityLike[] = [
  {
    amount: 1_000_000,
    assetId: BaseAssetId,
  },
];

describe('Script With Configurable', () => {
  it('should returns true when input value matches default configurable constant', async () => {
    using provider = await setupTestProvider();
    const wallet = await generateTestWallet(provider, quantities);

    const script = new Script(bytecode, abi, wallet);

    script.setConfigurableConstants(defaultValues);

    const { value } = await script.functions.main(defaultValues.FEE).call();

    // expected to be true
    expect(new BN(value as number).toNumber()).toEqual(1);
  });

  it('should returns false when input value differs from default configurable constant', async () => {
    using provider = await setupTestProvider();
    const wallet = await generateTestWallet(provider, quantities);
    const configurableConstants = { FEE: 71 };

    expect(configurableConstants.FEE).not.toEqual(defaultValues.FEE);

    const script = new Script(bytecode, abi, wallet);

    script.setConfigurableConstants(defaultValues);

    const { value } = await script.functions.main(configurableConstants.FEE).call();

    // expected to be false
    expect(new BN(value as number).toNumber()).toEqual(0);
  });

  it('should returns true when input value matches manually set configurable constant', async () => {
    using provider = await setupTestProvider();
    const wallet = await generateTestWallet(provider, quantities);
    const configurableConstants = { FEE: 35 };

    const script = new Script(bytecode, abi, wallet);

    script.setConfigurableConstants(configurableConstants);

    const { value } = await script.functions.main(configurableConstants.FEE).call();

    // expected to be true
    expect(new BN(value as number).toNumber()).toEqual(1);
  });

  it('should returns false when input value differs from manually set configurable constant', async () => {
    using provider = await setupTestProvider();
    const wallet = await generateTestWallet(provider, quantities);
    const configurableConstants = { FEE: 10 };

    const input = { FEE: 15 };

    expect(configurableConstants.FEE).not.toEqual(input.FEE);

    const script = new Script(bytecode, abi, wallet);

    script.setConfigurableConstants(configurableConstants);

    const { value } = await script.functions.main(input.FEE).call();

    // expected to be false
    expect(new BN(value as number).toNumber()).toEqual(0);
  });
});
