<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `VARIABLE_REF`

[CIR](../README.md) : [Expressions](./README.md)

The runtime value of a variable.

```ts
type VariableReference = {
  kind: 'VARIABLE_REF'
  name: string
  value: Lattice
}
```

## Rules for Frontend

- The `name` `MUST` indicate a variable declared in the current scope or a parent scope.
- The `value` `MUST` be a subset (sub-lattice) of the variable’s declared lattice.

## Rules for Backend

- The value of the expression `MUST` be the current runtime value of the indicated variable.
