<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Expressions

[CIR](../README.md)

`Expression`s are used as arguments for `Statement`s and other `Expression`s.

```ts
type Expression =
  | StringLiteral
  | IntegerLiteral
  | TruthLiteral
  | MemoryAllocation
  | MemoryRetention
  | AsShared
  | VariableReference
  | FieldReference
  | FunctionCall
```

## `STRING_LITERAL`

A `STRING_LITERAL` is a simple textual value. 

```ts
type StringLiteral = {
  kind: 'STRING_LITERAL'
  value: string
}
```

[Click here](./STRING_LITERAL) for details

## `INTEGER_LITERAL`

An `INTEGER_LITERAL` is a simple integer value. It may be arbitrarily large.

```ts
type IntegerLiteral = {
  kind: 'INTEGER_LITERAL'
  value: string
}
```

[Click here](./INTEGER_LITERAL) for details

## `TRUTHVALUE_LITERAL`

A `TRUTHVALUE_LITERAL` is a simple three-state truth value

```ts
type TruthLiteral = {
  kind: 'TRUTHVALUE_LITERAL'
  value: 'false' | 'ambiguous' | 'true'
}
```

[Click here](./TRUTHVALUE_LITERAL.md) for details

## `CALL`

A `CALL` expression executes a function and returns its result.

```ts
type FunctionCall = {
  kind: 'CALL'
  receiver?: Receiver
  name: {
    namespace?: string
    baseName: string
    labels: string[]
  }
  arguments: Expression[]
}
```

[Click here](./CALL.md) for details

## `ALLOCATION`

An `ALLOCATION` allocates memory for a reference-counted entity.

```ts
type MemoryAllocation = {
  kind: 'ALLOCATION'
  type: CanonicalName
  base?: CanonicalName
  isolationLevel: IsolationLevel
  fields: {
    name: string
    value: Expression
  }[]
}
```

[Click here](./CALL.md) for details

## `RETAIN`

Increment the reference count of an allocation. 

```ts
type MemoryRetention = {
  kind: 'RETAIN'
  object: Storage
}

type Storage = VariableReference | FieldReference
```

[Click here](./RETAIN.md) for details

## `AS_SHARED`

Upgrades a uniquely referenced `ISOLATED` value to a `SHARED` entity.

```ts
type AsShared = {
  kind: 'AS_SHARED'
  object: FunctionCall
}
```

[Click here](./AS_SHARED.md) for details

## `VARIABLE_REF`

A reference to a local or global [`VARIABLE_DECL`](../declarations/VARIABLE_DECL.md).

```ts
type VariableReference = {
  kind: 'VARIABLE_REF'
  name: string
}
```

[Click here](./VARIABLE_REF.md) for details

### `FIELD_REF`

A reference to a field value of an object.

```ts
type FieldReference = {
  kind: 'FIELD_REF'
  object: Expression
  field: string
}
```

[Click here](./FIELD_REF.md) for details
