<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `ASSIGN`

[CIR](../README.md) : [Expressions](./README.md)

Assign a value to a variable or a field.

```ts
type Assign = {
  kind: 'ASSIGN'
  target: Storage
  value: Expression
}

type Storage = Omit<VariableReference, 'value'> | Omit<FieldReference, 'value'>
```

The `value` property indicates the returned value.

## Rules for Frontend

-

## Rules for Backend

-

### `VARIABLE_DECL`

```ts
type VariableDeclaration = {
  kind: 'VARIABLE_DECL'
  name: string
  namespace?: string
  lattice: Lattice
  initialValue: Expression
}
```

The variable declaration can also be used as a `Statement`. In other words, it `MAY` appear in a function body and in the `startBlock` of a module.
