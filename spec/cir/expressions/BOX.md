&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Expressions](./README.md)

# `BOX`

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

- The `expression` `MUST` be a primitive value.
- The `type` `MUST` have the `boxed` flag set.

## Rules for Backend

- The result `MUST` be a reference-counted allocation holding the primitive value, with a reference count of exactly 1. See [Automatic Reference Counting](../arc.md).
