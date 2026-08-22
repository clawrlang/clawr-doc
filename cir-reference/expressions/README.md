<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Expressions

[CIR](../README.md)

`Expression`s are used as arguments for `Statement`s and other `Expression`s.

Every expression has a `value` property. This is a `Lattice` that includes every possible value the expression can take at runtime. Sometimes the `value` is the full (top) lattice of the referenced variable or function. Sometimes the value is known exactly, down to a singleton set.

```ts
type Expression =
  | StringLiteral
  | IntegerLiteral<bigint>
  | TruthLiteral<truthvalue>
  | MemoryAllocation
  | MemoryRetention
  | AsShared
  | VariableReference
  | FieldReference
  | (FunctionCall & { value: Lattice })
```

## `STRING_LITERAL`

A `STRING_LITERAL` is a simple textual value.

```ts
type StringLiteral = {
  kind: 'STRING_LITERAL'
  value: StringLattice & { value: string }
}
```

[Click here](./STRING_LITERAL) for details

## `INTEGER_LITERAL`

An `INTEGER_LITERAL` is a simple integer value. It may be arbitrarily large.

```ts
type IntegerLiteral<Value extends bigint> = {
  kind: 'INTEGER_LITERAL'
  value: IntegerLattice<Value, Value>
}
```

[Click here](./INTEGER_LITERAL) for details

## `TRUTHVALUE_LITERAL`

A `TRUTHVALUE_LITERAL` is a simple three-state truth value

```ts
type TruthLiteral<Value extends truthvalue> = {
  kind: 'TRUTHVALUE_LITERAL'
  value: TruthvalueLattice<[Value]>
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
  value: Lattice
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
  value: RCTypeLattice
}
```

[Click here](./CALL.md) for details

## `RETAIN`

Increment the reference count of an allocation.

```ts
type MemoryRetention = {
  kind: 'RETAIN'
  object: Storage
  value: RCTypeLattice
}

type Storage = Omit<VariableReference, 'value'> | Omit<FieldReference, 'value'>
```

[Click here](./RETAIN.md) for details

## `AS_SHARED`

Upgrades a uniquely referenced `ISOLATED` value to a `SHARED` entity.

```ts
type AsShared = {
  kind: 'AS_SHARED'
  object: FunctionCall & Expression
  value: RCTypeLattice
}
```

[Click here](./AS_SHARED.md) for details

## `VARIABLE_REF`

A reference to a local or global [`VARIABLE_DECL`](../declarations/VARIABLE_DECL.md).

```ts
type VariableReference = {
  kind: 'VARIABLE_REF'
  name: string
  value: Lattice
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
  value: Lattice
}
```

[Click here](./FIELD_REF.md) for details
