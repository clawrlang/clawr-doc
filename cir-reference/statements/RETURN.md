# `RETURN`

[CIR](../README.md) : [Expressions](./README.md)

Return early from a `void` function or return a value from a query function.

<!-- shape: Return -->

| Field   | Required | Type         | Meaning                            |
| ------- | -------- | ------------ | ---------------------------------- |
| `kind`  | yes      | `"RETURN"`   | Declaration discriminator.         |
| `value` | no       | `Expression` | The value to return to the caller. |

> [!info] Table: the properties of the `RETURN` node

<!-- /shape: Return -->

The `value` property indicates the returned value.

## Rules for Frontend

- If the current function has `returnType: {"universe":"void"}`, the `value` property `MUST` be omitted.
- If the current function has a non-void `returnType`, the `value` property `MUST NOT` be omitted.
- The `value` `MUST` match the `isolationLevel` and `returnType` of the current function.

## Rules for Backend

-
