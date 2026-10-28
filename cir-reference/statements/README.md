&nbsp; / &nbsp;[CIR Reference](../README.md)

# Statements

Statements are added to the `startBlock` of a module, and to the `body` of a function. Statements `MUST NOT` be reordered or skipped when lowering. An optimisation step `MAY` however perform limited changes.

## ENSURE_UNIQUE

An [`ENSURE_UNIQUE`](ENSURE_UNIQUE.md) statement is injected by the frontend before mutations to preserve state isolation between copy-on-write variables and properties.

<!-- shape: EnsureUnique -->

| Field    | Required | Type              | Meaning                                        |
| -------- | -------- | ----------------- | ---------------------------------------------- |
| `kind`   | yes      | `"ENSURE_UNIQUE"` | Declaration discriminator.                     |
| `object` | yes      | `Storage`         | The variable or field to isolate for mutation. |

> [!info] Table: the properties of the `ENSURE_UNIQUE` node

<!-- /shape: EnsureUnique -->

[Click here](ENSURE_UNIQUE.md) for more details

## `RELEASE`

The [`RELEASE`](./RELEASE.md) statement decrements the reference count of a block of memory.

<!-- shape: Release -->

| Field    | Required | Type        | Meaning                                 |
| -------- | -------- | ----------- | --------------------------------------- |
| `kind`   | yes      | `"RELEASE"` | Declaration discriminator.              |
| `object` | yes      | `Storage`   | The variable or field that exits scope. |

> [!info] Table: the properties of the `RELEASE` node

<!-- /shape: Release -->

[Click here](./RELEASE.md) for more details

## `CALL`

A `CALL` expression executes a function.

<!-- shape: FunctionCallStatement -->

| Field       | Required | Type           | Meaning                                |
| ----------- | -------- | -------------- | -------------------------------------- |
| `kind`      | yes      | `"CALL"`       | Declaration discriminator.             |
| `receiver`  | no       | `Receiver`     | The object whose method to call.       |
| `name`      | yes      | `FunctionName` | The name of the function to call.      |
| `arguments` | yes      | `Expression[]` | The arguments to send to the function. |

> [!info] Table: the properties of the `CALL` node

<!-- /shape: FunctionCallStatement -->

[Click here](./CALL.md) for more details

## `RETURN`

Return early from a `void` function or return a value from a query function.

<!-- shape: Return -->

| Field   | Required | Type         | Meaning                            |
| ------- | -------- | ------------ | ---------------------------------- |
| `kind`  | yes      | `"RETURN"`   | Declaration discriminator.         |
| `value` | no       | `Expression` | The value to return to the caller. |

> [!info] Table: the properties of the `RETURN` node

<!-- /shape: Return -->

[Click here](./RETURN.md) for more details

### `ASSIGN`

Assign a value to a variable or a property.

<!-- shape: Assign -->

| Field    | Required | Type         | Meaning                        |
| -------- | -------- | ------------ | ------------------------------ |
| `kind`   | yes      | `"ASSIGN"`   | Declaration discriminator.     |
| `target` | yes      | `Storage`    | Target to mutate.              |
| `value`  | yes      | `Expression` | Value to assign to the target. |

> [!info] Table: the properties of the `ASSIGN` node

<!-- /shape: Assign -->

[Click here](./ASSIGN.md) for more details

### `SELF_INIT`

Initialize the properties of the `self` entity.

<!-- shape: SelfInitialization -->

| Field        | Required | Type                    | Meaning                                           |
| ------------ | -------- | ----------------------- | ------------------------------------------------- |
| `kind`       | yes      | `"SELF_INIT"`           | Declaration discriminator.                        |
| `type`       | yes      | `RCTypeSet`             | The type of the `self` variable.                  |
| `properties` | yes      | `PropertyInitializer[]` | Property values for initialization discriminator. |

> [!info] Table: the properties of the `SELF_INIT` node

<!-- /shape: SelfInitialization -->

[Click here](./SELF_INIT.md) for more details

## `VARIABLE_DECL`

The variable declaration can also be used as a `Statement`. In other words, it `MAY` appear in a function body and in the `startBlock` of a module.

<!-- shape: VariableDeclaration -->

| Field          | Required | Type              | Meaning                            |
| -------------- | -------- | ----------------- | ---------------------------------- |
| `kind`         | yes      | `"VARIABLE_DECL"` | Declaration discriminator.         |
| `name`         | yes      | `string`          | The name of the declared variable. |
| `namespace`    | no       | `string`          | Optional namespace.                |
| `type`         | yes      | `ValueSet`        | The type of the variable.          |
| `initialValue` | yes      | `Expression`      | The initial value of the variable. |

> [!info] Table: the properties of the `VARIABLE_DECL` node

<!-- /shape: VariableDeclaration -->

[Click here](./VARIABLE_DECL.md) for more details
