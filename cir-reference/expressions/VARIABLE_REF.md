<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `VARIABLE_REF`

[CIR](../README.md) : [Expressions](./README.md)

The runtime value of a variable. The `valueSet` returns the best lattice knowledge of the variable's current value. The variable might be defined as an unconstrained `integer`, but could still be known within a certain range at this point. The backend `MAY` use this information to optimise the lowered statement.


```ts
type VariableReference = {
  kind: 'VARIABLE_REF'
  name: string
}
```

## Rules for Frontend

- The `name` `MUST` indicate a variable declared in the current scope or a parent scope.

## Rules for Backend

- The value of the expression `MUST` be the current runtime value of the indicated variable.
