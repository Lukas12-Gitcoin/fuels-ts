import { arrayify, hexlify } from '@ethersproject/bytes';
import type { Witness } from '@fuel-ts/transactions';
import type { BytesLike } from 'ethers';

export type TransactionRequestWitness = BytesLike;

export const witnessify = (value: TransactionRequestWitness): Witness => {
  const data = arrayify(value);

  return {
    data: hexlify(data),
    dataLength: data.length,
  };
};
