# `PROPERTY_REF`

[CIR](../README.md) : [Expressions](./README.md)

The runtime value of a property.

<!-- shape: PropertyReference -->

| Field      | Required | Type             | Meaning                              |
| ---------- | -------- | ---------------- | ------------------------------------ |
| `kind`     | yes      | `"PROPERTY_REF"` | Declaration discriminator.           |
| `object`   | yes      | `Expression`     | The object that owns the property    |
| `property` | yes      | `string`         | The name of the referenced property. |
| `type`     | yes      | `ValueSet`       | The type of the referenced property. |

> [!info] Table: the properties of the `PROPERTY_REF` node

<!-- /shape: PropertyReference -->

## Rules for Frontend

- The `object` property `MUST` indicate a value that has an [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md) type.
- The `property` property `MUST` match the name of a declared property in the corresponding [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md).
- The `type` `MUST` be the property’s declared `type`.

## Rules for Backend

- The value of the expression `MUST` be the current runtime value of the indicated variable.
