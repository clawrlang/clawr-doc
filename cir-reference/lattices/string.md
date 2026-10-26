# `string`

[CIR](../README.md) : [Lattices](./README.md)

An unconstrained string value. A “string” is a sequence of characters and the `string` value-set is the set of all possible sequences.

There is no way to construct a subset at this time, though future ideas include singleton sets (knowing the value precisely), and strings matching a regular expression.

The schema accepts either an unconstrained string set or a singleton value:

<!-- shape: StringSet -->

| Field      | Required | Type       | Meaning                      |
| ---------- | -------- | ---------- | ---------------------------- |
| `universe` | yes      | `"string"` | Declaration discriminator.   |
| `value`    | no       | `string`   | The single value in the set. |

> [!info] Table: the properties of the `string` node

<!-- /shape: StringSet -->
