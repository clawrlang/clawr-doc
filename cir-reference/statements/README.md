<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Statements

[CIR](../README.md)

Statements are added to the `startBlock` of a module, and to the `body` of a function. Statements `MUST NOT` be reordered or skipped when lowering. An optimisation step `MAY` however perform limited changes.

## ENSURE_UNIQUE

An [`ENSURE_UNIQUE`](ENSURE_UNIQUE.md) statement is injected by the frontend before mutations to preserve state isolation between copy-on-write variables and properties.

```json
{ "$ref": "../cir.schema.json#/$defs/EnsureUnique" }
```

[Click here](ENSURE_UNIQUE.md) for more details

## `RELEASE`

The [`RELEASE`](./RELEASE.md) statement decrements the reference count of a block of memory.

```json
{ "$ref": "../cir.schema.json#/$defs/Release" }
```

[Click here](./RELEASE.md) for more details

## `CALL`

A `CALL` expression executes a function.

```json
{ "$ref": "../cir.schema.json#/$defs/FunctionCallStatement" }
```

[Click here](./CALL.md) for more details

## `RETURN`

Return early from a `void` function or return a value from a query function.

```json
{ "$ref": "../cir.schema.json#/$defs/Return" }
```

[Click here](./RETURN.md) for more details

### `ASSIGN`

Assign a value to a variable or a property.

```json
{ "$ref": "../cir.schema.json#/$defs/Assign" }
```

[Click here](./ASSIGN.md) for more details

### `SELF_ASSIGN`

Initialize the properties of the `self` entity.

```json
{ "$ref": "../cir.schema.json#/$defs/SelfAssignment" }
```

[Click here](./SELF_ASSIGN.md) for more details

## `VARIABLE_DECL`

The variable declaration can also be used as a `Statement`. In other words, it `MAY` appear in a function body and in the `startBlock` of a module.

```json
{ "$ref": "../cir.schema.json#/$defs/VariableDeclaration" }
```

[Click here](./VARIABLE_DECL.md) for more details
