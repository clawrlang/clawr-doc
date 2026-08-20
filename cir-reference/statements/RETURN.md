<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `RETURN`

[CIR](../README.md) : [Expressions](./README.md)

Return early from a `void` function or return a value from a query function.

```ts
type Return = {
  kind: 'RETURN'
  value?: Expression
}
```

The `value` property indicates the returned value.

## Rules for Frontend

- If the current scope does not have a `returnValueSet`, the `value` property `MUST` be omitted (or `null`).
- If the current scope does have a `returnValueSet`, the `value` property `MUST NOT` be omitted (nor `null`).
- The `value` `MUST` match the `isolationLevel` and `resultValueSet` of the current function.

## Rules for Backend

- 
