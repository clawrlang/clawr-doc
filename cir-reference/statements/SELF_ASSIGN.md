<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `SELF_ASSIGN`

[CIR](../README.md) : [Expressions](./README.md)

Initialize the fields of the `self` entity.

```ts
type SelfAssign = {
  kind: 'SELF_ASSIGN'
  value: {
    kind: 'DATA'
    fields: {
      name: string
      value: Expression
    }[]
    value: RCTypeLattice
  }
}
```

The `value` property indicates the type of `self`. In the case of inheritance, the indicated type is one type in the inheritance hierarchy and the owning type of the fields being initialized.

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
