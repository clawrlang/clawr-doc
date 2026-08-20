<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `VARIABLE_DECL`

[CIR](../README.md) : [Expressions](./README.md)

The variable declaration can also be used as a `Statement`. In other words, it `MAY` appear in a function body and in the `startBlock` of a module.

```ts
type VariableDeclaration = {
  kind: 'VARIABLE_DECL'
  name: string
  valueSet: ValueSet
  initialValue: Expression
}
```

The `value` property indicates the returned value.

## Rules for Frontend

- 

## Rules for Backend

- 

