---
layout: default
title: InputCoinCoder
parent: "@fuel-ts/transactions"
nav_order: 1

---

# Class: InputCoinCoder

[@fuel-ts/transactions](../index.md).InputCoinCoder

## Hierarchy

- `default`<[`InputCoin`](../index.md#inputcoin), [`InputCoin`](../index.md#inputcoin)\>

  ↳ **`InputCoinCoder`**

## Constructors

### constructor

• **new InputCoinCoder**()

#### Overrides

Coder&lt;InputCoin, InputCoin\&gt;.constructor

#### Defined in

[packages/transactions/src/coders/input.ts:41](https://github.com/FuelLabs/fuels-ts/blob/master/packages/transactions/src/coders/input.ts#L41)

## Properties

### encodedLength

• `Readonly` **encodedLength**: `number`

#### Inherited from

Coder.encodedLength

#### Defined in

[packages/abi-coder/src/coders/abstract-coder.ts:36](https://github.com/FuelLabs/fuels-ts/blob/master/packages/abi-coder/src/coders/abstract-coder.ts#L36)

___

### name

• `Readonly` **name**: `string`

#### Inherited from

Coder.name

#### Defined in

[packages/abi-coder/src/coders/abstract-coder.ts:34](https://github.com/FuelLabs/fuels-ts/blob/master/packages/abi-coder/src/coders/abstract-coder.ts#L34)

___

### type

• `Readonly` **type**: `string`

#### Inherited from

Coder.type

#### Defined in

[packages/abi-coder/src/coders/abstract-coder.ts:35](https://github.com/FuelLabs/fuels-ts/blob/master/packages/abi-coder/src/coders/abstract-coder.ts#L35)

## Methods

### decode

▸ **decode**(`data`, `offset`): [[`InputCoin`](../index.md#inputcoin), `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` |
| `offset` | `number` |

#### Returns

[[`InputCoin`](../index.md#inputcoin), `number`]

#### Overrides

Coder.decode

#### Defined in

[packages/transactions/src/coders/input.ts:62](https://github.com/FuelLabs/fuels-ts/blob/master/packages/transactions/src/coders/input.ts#L62)

___

### encode

▸ **encode**(`value`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`InputCoin`](../index.md#inputcoin) |

#### Returns

`Uint8Array`

#### Overrides

Coder.encode

#### Defined in

[packages/transactions/src/coders/input.ts:45](https://github.com/FuelLabs/fuels-ts/blob/master/packages/transactions/src/coders/input.ts#L45)

___

### throwError

▸ **throwError**(`message`, `value`): `never`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `value` | `unknown` |

#### Returns

`never`

#### Inherited from

Coder.throwError

#### Defined in

[packages/abi-coder/src/coders/abstract-coder.ts:44](https://github.com/FuelLabs/fuels-ts/blob/master/packages/abi-coder/src/coders/abstract-coder.ts#L44)