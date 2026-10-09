<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `VARIABLE_REF`

[CIR](../README.md) : [Expressions](./README.md)

The runtime value of a variable.

```ts
type VariableReference = {
  kind: 'VARIABLE_REF'
  name: string
  domain: ValueSet
}
```

## Rules for Frontend

- The `name` `MUST` indicate a variable declared in the current scope or a parent scope.
- The `domain` `MUST` be a subset of the variable’s declared domain.

## Rules for Backend

- The value of the expression `MUST` be the current runtime value of the indicated variable.
