# `BOX`

[CIR](../README.md) : [Expressions](./README.md)

A `BOX` is reference-counted wrapper for a primitive value.

<!-- shape: Box -->

| Field        | Required | Type         | Meaning                                            |
| ------------ | -------- | ------------ | -------------------------------------------------- |
| `kind`       | yes      | `"BOX"`      | Declaration discriminator.                         |
| `expression` | yes      | `Expression` | The primitive value to box.                        |
| `type`       | yes      | `ValueSet`   | The type of the boxed value (with boxed flag set). |

> [!info] Table: the properties of the `BOX` node

<!-- /shape: Box -->

## Rules for Frontend

## Rules for Backend
