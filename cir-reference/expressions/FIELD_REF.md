<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `FIELD_REF`

[CIR](../README.md) : [Expressions](./README.md)

The runtime value of a property.

```ts
type PropertyReference = {
  kind: 'PROPERTY_REF'
  object: Expression
  property: string
  domain: ValueSet
}
```

## Rules for Frontend

- The `object` property `MUST` indicate a value that has an [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md) type.
- The `property` property `MUST` match the name of a declared property in the corresponding [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md).
- The `domain` `MUST` be the property’s declared domain.

## Rules for Backend

- The value of the expression `MUST` be the current runtime value of the indicated variable.
