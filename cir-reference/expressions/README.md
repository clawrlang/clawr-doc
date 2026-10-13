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

```json
{ "$ref": "../cir.schema.json#/$defs/StringLiteral" }
```

[Click here](./STRING_LITERAL) for details

## `INTEGER_LITERAL`

An `INTEGER_LITERAL` is a simple integer value. It may be arbitrarily large.

```json
{ "$ref": "../cir.schema.json#/$defs/IntegerLiteral" }
```

[Click here](./INTEGER_LITERAL) for details

## `TRUTHVALUE_LITERAL`

A `TRUTHVALUE_LITERAL` is a simple three-state truth value

```json
{ "$ref": "../cir.schema.json#/$defs/TruthvalueLiteral" }
```

[Click here](./TRUTHVALUE_LITERAL.md) for details

## `CALL`

A `CALL` expression executes a function and returns its result.

```json
{ "$ref": "../cir.schema.json#/$defs/FunctionCallExpression" }
```

[Click here](./CALL.md) for details

## `ALLOCATION`

An `ALLOCATION` allocates memory for a reference-counted entity.

```json
{ "$ref": "../cir.schema.json#/$defs/Allocation" }
```

[Click here](./ALLOCATION.md) for details

## `RETAIN`

Increment the reference count of an allocation.

```json
{ "$ref": "../cir.schema.json#/$defs/Retain" }
```

[Click here](./RETAIN.md) for details

## `AS_SHARED`

Upgrades a uniquely referenced `ISOLATED` value to a `SHARED` entity.

```json
{ "$ref": "../cir.schema.json#/$defs/AsShared" }
```

[Click here](./AS_SHARED.md) for details

## `BOX`

A `BOX` is reference-counted wrapper for a primitive value.

```json
{ "$ref": "../cir.schema.json#/$defs/Box" }
```

[Click here](./BOX.md) for details

## `VARIABLE_REF`

A reference to a local or global [`VARIABLE_DECL`](../declarations/VARIABLE_DECL.md).

```json
{ "$ref": "../cir.schema.json#/$defs/VariableReference" }
```

[Click here](./VARIABLE_REF.md) for details

### `FIELD_REF`

A reference to a property value of an object.

```json
{ "$ref": "../cir.schema.json#/$defs/PropertyReference" }
```

[Click here](./FIELD_REF.md) for details
