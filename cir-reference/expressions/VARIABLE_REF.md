<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `VARIABLE_REF`

[CIR](../README.md) : [Expressions](./README.md)

The runtime value of a variable.

<!-- shape: VariableReference -->

| Field  | Required | Type             | Meaning                              |
| ------ | -------- | ---------------- | ------------------------------------ |
| `kind` | yes      | `"VARIABLE_REF"` | Declaration discriminator.           |
| `name` | yes      | `string`         | The name of the referenced variable. |
| `type` | yes      | `ValueSet`       | The type of the variable.            |

> [!info] Table: the properties of the `VARIABLE_REF` node

<!-- /shape: VariableReference -->

## Rules for Frontend

- The `name` `MUST` indicate a variable declared in the current scope or a parent scope.
- The `type` `MUST` be a subset of the variable’s declared `type`.

## Rules for Backend

- The value of the expression `MUST` be the current runtime value of the indicated variable.
