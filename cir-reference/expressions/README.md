<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Expressions

[CIR](../README.md)

`Expression`s are used as arguments for `Statement`s and other `Expression`s.

Every expression has a `value` property. This is a `ValueSet` that includes every possible value the expression can take at runtime. Sometimes the `value` is the full domain of the referenced variable or function. Sometimes the value is known exactly, down to a singleton set.

```ts
type Expression =
  | StringLiteral
  | IntegerLiteral
  | TruthvalueLiteral
  | MemoryAllocation
  | MemoryRetention
  | AsShared
  | Box
  | VariableReference
  | PropertyReference
  | (FunctionCall & { domain: ValueSet })
```

## `STRING_LITERAL`

A `STRING_LITERAL` is a simple textual value.

```ts
type StringLiteral = {
  kind: 'STRING_LITERAL'
  domain: StringSet & { value: string }
}
```

[Click here](./STRING_LITERAL) for details

## `INTEGER_LITERAL`

An `INTEGER_LITERAL` is a simple integer value. It may be arbitrarily large.

```ts
type IntegerLiteral<Value extends bigint = bigint> = {
  kind: 'INTEGER_LITERAL'
  domain: IntegerRange<Value, Value>
}
```

[Click here](./INTEGER_LITERAL) for details

## `TRUTHVALUE_LITERAL`

A `TRUTHVALUE_LITERAL` is a simple three-state truth value

```ts
type TruthvalueLiteral<Value extends truthvalue = truthvalue> = {
  kind: 'TRUTHVALUE_LITERAL'
  domain: TruthvalueSet<[Value]>
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
  domain: ValueSet
}
```

[Click here](./CALL.md) for details

## `ALLOCATION`

An `ALLOCATION` allocates memory for a reference-counted entity.

```ts
type MemoryAllocation = {
  kind: 'ALLOCATION'
  isolationLevel: IsolationLevel
  properties?: {
    name: string
    value: Expression
  }[]
  domain: RCTypeSet
}

type IsolationLevel = 'ISOLATED' | 'SHARED'
```

[Click here](./ALLOCATION.md) for details

## `RETAIN`

Increment the reference count of an allocation.

```ts
type MemoryRetention = {
  kind: 'RETAIN'
  object: Storage
  domain: RCTypeSet
}

type Storage =
  | Omit<VariableReference, 'domain'>
  | Omit<PropertyReference, 'domain'>
```

[Click here](./RETAIN.md) for details

## `AS_SHARED`

Upgrades a uniquely referenced `ISOLATED` value to a `SHARED` entity.

```ts
type AsShared = {
  kind: 'AS_SHARED'
  object: FunctionCall & Expression
  domain: RCTypeSet
}
```

[Click here](./AS_SHARED.md) for details

## `BOX`

A `BOX` is reference-counted wrapper for a primitive value.

```ts
type Box = {
  kind: 'BOX'
  expression: Expression
  domain: ValueSet & { boxed: true }
}
```

[Click here](./BOX.md) for details

## `VARIABLE_REF`

A reference to a local or global [`VARIABLE_DECL`](../declarations/VARIABLE_DECL.md).

```ts
type VariableReference = {
  kind: 'VARIABLE_REF'
  name: string
  domain: ValueSet
}
```

[Click here](./VARIABLE_REF.md) for details

### `FIELD_REF`

A reference to a property value of an object.

```ts
type PropertyReference = {
  kind: 'PROPERTY_REF'
  object: Expression
  property: string
  domain: ValueSet
}
```

[Click here](./FIELD_REF.md) for details
