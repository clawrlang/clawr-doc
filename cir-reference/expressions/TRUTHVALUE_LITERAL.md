<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `TRUTHVALUE_LITERAL`

[CIR](../README.md) : [Expressions](./README.md)

A `TRUTHVALUE_LITERAL` is a simple three-state truth value.

```ts
type TruthLiteral = {
  kind: 'TRUTHVALUE_LITERAL'
  value: 'false' | 'ambiguous' | 'true'
}
```

The `value` can be either of `"false"`, `"ambiguous"` or `"true"`. The `ambiguous` state is considered neither completely true nor completely false. When used in control-flow, both `ambiguous` and `NOT ambiguous` are considered equivalent to `false`.

## Rules for Frontend

- The `value` property `MUST` contain a single value, from the list `"false"`, `"ambiguous"` and `"true"`.

## Rules for Backend

- The backend `MUST` treat the three different values as separate and mutually unequal.
