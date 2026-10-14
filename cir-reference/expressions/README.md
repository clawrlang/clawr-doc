<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Expressions

[CIR](../README.md)

`Expression`s are used as arguments for `Statement`s and other `Expression`s.

Every expression has a `type` property. This is a `ValueSet` that includes every possible value the expression can take at runtime. Sometimes the `type` is the full value-set of the referenced variable or function. Sometimes the value is known exactly, down to a singleton set.

```json
{ "$ref": "../cir.schema.json#/$defs/Expression" }
```

## `STRING_LITERAL`

A `STRING_LITERAL` is a simple textual value.

<!-- shape: StringLiteral -->

| Field  | Required | Type               | Meaning                     |
| ------ | -------- | ------------------ | --------------------------- |
| `kind` | yes      | `"STRING_LITERAL"` | Declaration discriminator.  |
| `type` | yes      | `StringSingleton`  | The type of the expression. |

> [!info] Table: the properties of the `STRING_LITERAL` node

<!-- /shape: StringLiteral -->

[Click here](./STRING_LITERAL) for details

## `INTEGER_LITERAL`

An `INTEGER_LITERAL` is a simple integer value. It may be arbitrarily large.

<!-- shape: IntegerLiteral -->

| Field  | Required | Type                | Meaning                                              |
| ------ | -------- | ------------------- | ---------------------------------------------------- |
| `kind` | yes      | `"INTEGER_LITERAL"` | Declaration discriminator.                           |
| `type` | yes      | `IntegerSingleton`  | The type of the literal (specified its exact value). |

> [!info] Table: the properties of the `INTEGER_LITERAL` node

<!-- /shape: IntegerLiteral -->

[Click here](./INTEGER_LITERAL) for details

## `TRUTHVALUE_LITERAL`

A `TRUTHVALUE_LITERAL` is a simple three-state truth value

<!-- shape: TruthvalueLiteral -->

| Field  | Required | Type                   | Meaning                     |
| ------ | -------- | ---------------------- | --------------------------- |
| `kind` | yes      | `"TRUTHVALUE_LITERAL"` | Declaration discriminator.  |
| `type` | yes      | `TruthvalueSingleton`  | The type of the expression. |

> [!info] Table: the properties of the `TRUTHVALUE_LITERAL` node

<!-- /shape: TruthvalueLiteral -->

[Click here](./TRUTHVALUE_LITERAL.md) for details

## `CALL`

A `CALL` expression executes a function and returns its result.

<!-- shape: FunctionCallExpression -->

| Field       | Required | Type           | Meaning                                |
| ----------- | -------- | -------------- | -------------------------------------- |
| `kind`      | yes      | `"CALL"`       | Declaration discriminator.             |
| `receiver`  | no       | `Receiver`     | The object whose method to call.       |
| `name`      | yes      | `FunctionName` | The name of the function to call.      |
| `arguments` | yes      | `Expression[]` | The arguments to send to the function. |
| `type`      | yes      | `ValueSet`     | The type of the returned value.        |

> [!info] Table: the properties of the `CALL` node

<!-- /shape: FunctionCallExpression -->

[Click here](./CALL.md) for details

## `ALLOCATION`

An `ALLOCATION` allocates memory for a reference-counted entity.

<!-- shape: Allocation -->

| Field            | Required | Type                    | Meaning                                                           |
| ---------------- | -------- | ----------------------- | ----------------------------------------------------------------- |
| `kind`           | yes      | `"ALLOCATION"`          | Declaration discriminator.                                        |
| `isolationLevel` | yes      | `IsolationLevel`        | The isolation level (ISOLATED od SHARED) of the allocated entity. |
| `properties`     | no       | `PropertyInitializer[]` | Property values for initialization.                               |
| `type`           | yes      | `RCTypeSet`             | The type of the allocated entity.                                 |

> [!info] Table: the properties of the `ALLOCATION` node

<!-- /shape: Allocation -->

[Click here](./ALLOCATION.md) for details

## `RETAIN`

Increment the reference count of an allocation.

<!-- shape: Retain -->

| Field    | Required | Type        | Meaning                          |
| -------- | -------- | ----------- | -------------------------------- |
| `kind`   | yes      | `"RETAIN"`  | Declaration discriminator.       |
| `object` | yes      | `Storage`   | The variable or field to retain. |
| `type`   | yes      | `RCTypeSet` | The type of the retained entity. |

> [!info] Table: the properties of the `RETAIN` node

<!-- /shape: Retain -->

[Click here](./RETAIN.md) for details

## `AS_SHARED`

Upgrades a uniquely referenced `ISOLATED` value to a `SHARED` entity.

<!-- shape: AsShared -->

| Field    | Required | Type                     | Meaning                           |
| -------- | -------- | ------------------------ | --------------------------------- |
| `kind`   | yes      | `"AS_SHARED"`            | Declaration discriminator.        |
| `object` | yes      | `FunctionCallExpression` | The entity to promote to sharing. |
| `type`   | yes      | `RCTypeSet`              | The type of the entity.           |

> [!info] Table: the properties of the `AS_SHARED` node

<!-- /shape: AsShared -->

[Click here](./AS_SHARED.md) for details

## `BOX`

A `BOX` is reference-counted wrapper for a primitive value.

<!-- shape: Box -->

| Field        | Required | Type         | Meaning                                            |
| ------------ | -------- | ------------ | -------------------------------------------------- |
| `kind`       | yes      | `"BOX"`      | Declaration discriminator.                         |
| `expression` | yes      | `Expression` | The primitive value to box.                        |
| `type`       | yes      | `ValueSet`   | The type of the boxed value (with boxed flag set). |

> [!info] Table: the properties of the `BOX` node

<!-- /shape: Box -->

[Click here](./BOX.md) for details

## `VARIABLE_REF`

A reference to a local or global [`VARIABLE_DECL`](../declarations/VARIABLE_DECL.md).

<!-- shape: VariableReference -->

| Field  | Required | Type             | Meaning                              |
| ------ | -------- | ---------------- | ------------------------------------ |
| `kind` | yes      | `"VARIABLE_REF"` | Declaration discriminator.           |
| `name` | yes      | `string`         | The name of the referenced variable. |
| `type` | yes      | `ValueSet`       | The type of the variable.            |

> [!info] Table: the properties of the `VARIABLE_REF` node

<!-- /shape: VariableReference -->

[Click here](./VARIABLE_REF.md) for details

### `PROPERTY_REF`

A reference to a property value of an object.

<!-- shape: PropertyReference -->

| Field      | Required | Type             | Meaning                              |
| ---------- | -------- | ---------------- | ------------------------------------ |
| `kind`     | yes      | `"PROPERTY_REF"` | Declaration discriminator.           |
| `object`   | yes      | `Expression`     | The object that owns the property    |
| `property` | yes      | `string`         | The name of the referenced property. |
| `type`     | yes      | `ValueSet`       | The type of the referenced property. |

> [!info] Table: the properties of the `PROPERTY_REF` node

<!-- /shape: PropertyReference -->

[Click here](./PROPERTY_REF.md) for details

### Arithmetic Operators

[Click here](./arithmetic-operators.md) for details

### Comparison Operators

[Click here](./comparison-operators.md) for details

### Logic Operators

[Click here](./AND-OR.md) for details

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
