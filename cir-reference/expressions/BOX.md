<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `BOX`

[CIR](../README.md) : [Expressions](./README.md)

A `BOX` is reference-counted wrapper for a primitive value.

```ts
type Box = {
  kind: 'BOX'
  expression: Expression
  value: Lattice & { boxed: true }
}
```

## Rules for Frontend

## Rules for Backend

