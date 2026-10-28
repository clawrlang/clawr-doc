&nbsp; / &nbsp;[CIR Reference](../README.md) &nbsp; / &nbsp; [Expressions](./README.md)

# `VARIABLE_REF`

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
