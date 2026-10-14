<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `PROPERTY_REF`

[CIR](../README.md) : [Expressions](./README.md)

The runtime value of a property.

| Field      | Required | Type             | Meaning                              |
| ---------- | -------- | ---------------- | ------------------------------------ |
| `kind`     | yes      | `"PROPERTY_REF"` | Declaration discriminator.           |
| `object`   | yes      | `Expression`     | The object that owns the property    |
| `property` | yes      | `string`         | The name of the referenced property. |
| `type`     | no       | `ValueSet`       | The type of the referenced property. |

> [!info] Table: the properties of the `PROPERTY_REF` node

## Rules for Frontend

- The `object` property `MUST` indicate a value that has an [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md) type.
- The `property` property `MUST` match the name of a declared property in the corresponding [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md).
- The `type` `MUST` be the property’s declared `type`.

## Rules for Backend

- The value of the expression `MUST` be the current runtime value of the indicated variable.

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
