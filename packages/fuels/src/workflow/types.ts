import type { BytesLike } from '@ethersproject/bytes';
import type { CreateTransactionRequestLike } from '@fuel-ts/providers';
import type { StorageSlot } from '@fuel-ts/transactions';

export type DeployContractOptions = {
  salt?: BytesLike;
  storageSlots?: StorageSlot[];
  stateRoot?: BytesLike;
} & CreateTransactionRequestLike;

export enum Commands {
  'build' = 'build',
  'deploy' = 'deploy',
  'types' = 'types',
  'run' = 'run',
}

export type ActionEvent =
  | {
      type: Commands.types;
      data: unknown;
    }
  | {
      type: Commands.build;
      data: unknown;
    }
  | {
      type: Commands.deploy;
      data: Array<ContractDeployed>;
    }
  | {
      type: Commands.run;
      data: Array<ContractDeployed>;
    };

export type ContractDeployed = {
  name: string;
  contractId: string;
};

export type DeployOptions = {
  contracts: Array<ContractDeployed>;
  contractName: string;
  contractPath: string;
};

export type OptionsFunction = (
  opt: DeployOptions
) => DeployContractOptions | Promise<DeployContractOptions>;

export type FuelsConfig = {
  onSuccess?: (event: ActionEvent, config: LoadedConfig) => void;
  onFailure?: (err: unknown, config: LoadedConfig) => void;
  privateKey?: string;
  providerUrl?: string;
  deployConfig?: DeployContractOptions | OptionsFunction;
  workspace?: string;
  scripts?: Array<string>;
  contracts?: Array<string>;
  predicates?: Array<string>;
  output?: string;
};

export type LoadedConfig = {
  basePath: string;
  onSuccess?: (event: ActionEvent, config: LoadedConfig) => void;
  onFailure?: (err: unknown, config: LoadedConfig) => void;
  privateKey?: string;
  providerUrl?: string;
  deployConfig?: DeployContractOptions | OptionsFunction;
  workspace?: string;
  scripts: Array<string>;
  contracts: Array<string>;
  predicates: Array<string>;
  output: string;
};