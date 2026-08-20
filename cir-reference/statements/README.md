<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Statements

[CIR](../README.md)

Statements are added to the `startBlock` of a module, and to the `body` of a function. Statements `MUST NOT` be reordered or skipped when lowering. An optimisation step `MAY` however perform limited changes.

## ENSURE_UNIQUE

An [`ENSURE_UNIQUE`](ENSURE_UNIQUE.md) statement is injected by the frontend before mutations to preserve state isolation between copy-on-write variables and fields.

```ts
type EnsureUnique = {
  kind: 'ENSURE_UNIQUE'
  object: Storage
}
```

[Click here](ENSURE_UNIQUE.md) for more details

## `RELEASE`

The [`RELEASE`](./RELEASE.md) statement decrements the reference count of a block of memory.

```ts
type Release = {
  kind: 'RELEASE'
  object: Storage
}
```

[Click here](./RELEASE.md) for more details

## `CALL`

A `CALL` expression executes a function.

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

[Click here](./CALL.md) for more details

## `RETURN`

Return early from a `void` function or return a value from a query function.

```ts
type Return = {
  kind: 'RETURN'
  value?: Expression
}
```

[Click here](./RETURN.md) for more details

### `ASSIGN`

Assign a value to a variable or a field.

```ts
type Assign = {
  kind: 'ASSIGN'
  target: Storage
  value: Expression
}

type Storage = VariableReference | FieldReference
```

[Click here](./ASSIGN.md) for more details

## `VARIABLE_DECL`

The variable declaration can also be used as a `Statement`. In other words, it `MAY` appear in a function body and in the `startBlock` of a module.

```ts
type VariableDeclaration = {
  kind: 'VARIABLE_DECL'
  name: string
  valueSet: ValueSet
  initialValue: Expression
}
```

[Click here](./VARIABLE_DECL.md) for more details
