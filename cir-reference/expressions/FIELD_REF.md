<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `FIELD_REF`

[CIR](../README.md) : [Expressions](./README.md)

The runtime value of a field.

```ts
type FieldReference = {
  kind: 'FIELD_REF'
  object: Expression
  field: string
  value: Lattice
}
```

## Rules for Frontend

- The `object` property `MUST` indicate a value that has an [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md) type.
- The `field` property `MUST` match the name of a declared field in the corresponding [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md).
- The `value` `MUST` be a subset (sub-lattice) of the field’s declared lattice.

## Rules for Backend

- The value of the expression `MUST` be the current runtime value of the indicated variable.
