import type { DataOptions } from '@ethersproject/bytes';
import { hexlify, arrayify, concat } from '@ethersproject/bytes';
import { calcRoot, SparseMerkleTree } from '@fuel-ts/merkle';
import type { StorageSlot } from '@fuel-ts/transactions';
import { chunkAndPadBytes } from '@fuel-ts/utils';
import type { BytesLike } from 'ethers';
import { sha256 } from 'ethers';

/**
 * @hidden
 *
 * Get the Merkle root of a contract's bytecode.
 *
 * @param bytecode - The bytecode of the contract.
 * @returns The Merkle root of the contract's bytecode.
 */
export const getContractRoot = (bytecode: BytesLike): string => {
  const chunkSize = 16 * 1024;
  const bytes = arrayify(bytecode);
  const chunks = chunkAndPadBytes(bytes, chunkSize);

  return calcRoot(chunks.map((c) => hexlify(c)));
};

/**
 * @hidden
 *
 * Get the Merkle root of a contract's storage slots.
 *
 * @param storageSlots - An array of storage slots containing key-value pairs.
 * @returns The Merkle root of the contract's storage slots.
 */
export const getContractStorageRoot = (storageSlots: StorageSlot[]): string => {
  const tree = new SparseMerkleTree();

  storageSlots.forEach(({ key, value }) => tree.update(sha256(key), value));

  return tree.root;
};

/**
 * @hidden
 *
 * Get the contract ID of a contract based on its bytecode, salt,
 * and state root.
 *
 * @param bytecode - The bytecode of the contract.
 * @param salt - The salt value used for contract creation.
 * @param stateRoot - The state root of the contract.
 * @returns The contract ID of the contract.
 */
export const getContractId = (
  bytecode: BytesLike,
  salt: BytesLike,
  stateRoot: BytesLike
): string => {
  const root = getContractRoot(arrayify(bytecode));
  const contractId = sha256(concat(['0x4655454C', salt, root, stateRoot]));
  return contractId;
};

/**
 * @hidden
 *
 * Ensures that a string is hexlified.
 *
 * @param value - The value to be hexlified.
 * @param options - Options for hexlify.
 * @returns The input value hexlified.
 */
export const includeHexPrefix = (value: string, options?: DataOptions) =>
  hexlify(value, {
    ...options,
    allowMissingPrefix: true,
  });
