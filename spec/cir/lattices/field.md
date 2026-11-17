[CIR Reference](../README.md) / [Lattices](./README.md)

# Field Value-Sets

A field value-set identifies either `bitfield` or `tritfield`. An optional `length` constrains the exact number of lanes; if omitted, the field may have any length. Field value-sets are not boxed.

<!-- shape: FieldSet -->

| Field      | Required | Type                                       | Meaning                                      |
| ---------- | -------- | ------------------------------------------ | -------------------------------------------- |
| `universe` | yes      | <code>"bitfield" &#124; "tritfield"</code> | The kind of field.                           |
| `length`   | no       | `integer`                                  | The exact number of lanes, when constrained. |

> [!info] Table: the properties of the `bitfield` and `tritfield` nodes

<!-- /shape: FieldSet -->

The value-set can be written as either of these forms:

<!-- shape: BitfieldSet -->

| Field      | Required | Type         | Meaning                                      |
| ---------- | -------- | ------------ | -------------------------------------------- |
| `universe` | yes      | `"bitfield"` | The kind of field.                           |
| `length`   | no       | `integer`    | The exact number of lanes, when constrained. |

> [!info] Table: the properties of the `bitfield` node

<!-- /shape: BitfieldSet -->

<!-- shape: TritfieldSet -->

| Field      | Required | Type          | Meaning                                      |
| ---------- | -------- | ------------- | -------------------------------------------- |
| `universe` | yes      | `"tritfield"` | The kind of field.                           |
| `length`   | no       | `integer`     | The exact number of lanes, when constrained. |

> [!info] Table: the properties of the `tritfield` node

<!-- /shape: TritfieldSet -->

For source-language field semantics, see [Binary and Ternary Fields](../../language/builtin-types/fields.md).
