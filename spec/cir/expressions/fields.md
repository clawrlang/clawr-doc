[CIR Reference](../README.md) / [Expressions](./README.md)

# Field Expressions

Field expressions operate on unboxed fields. Every result's `type` is a field value-set, except `FIELD_LENGTH`, whose result has an integer value-set, and `FIELD_LANE`, whose result has a truthvalue value-set.

## `FIELD_FROM_STRING`

Construct a field from a string expression.

<!-- shape: FieldFromString -->

| Field   | Required | Type                    | Meaning                                            |
| ------- | -------- | ----------------------- | -------------------------------------------------- |
| `kind`  | yes      | `"FIELD_FROM_STRING"`   | Expression discriminator.                          |
| `value` | yes      | `StringValueExpression` | The string expression used to construct the field. |
| `type`  | yes      | `FieldSet`              | The field kind and optional exact lane count.      |

> [!info] Table: the properties of the `FIELD_FROM_STRING` node

<!-- /shape: FieldFromString -->

The string must contain only the lane symbols allowed by the result field kind. The field's lane count is the string length. When the input's length is known statically, the frontend `MUST` include that exact length in the result type.

## `FIELD_NOT`

Negate each lane of a field.

<!-- shape: FieldNot -->

| Field     | Required | Type                   | Meaning                                              |
| --------- | -------- | ---------------------- | ---------------------------------------------------- |
| `kind`    | yes      | `"FIELD_NOT"`          | Expression discriminator.                            |
| `operand` | yes      | `FieldValueExpression` | The field whose lanes are negated.                   |
| `type`    | yes      | `FieldSet`             | The result field kind and optional exact lane count. |

> [!info] Table: the properties of the `FIELD_NOT` node

<!-- /shape: FieldNot -->

The operand and result `MUST` have the same field kind and lane count. Ternary `ambiguous` lanes remain ambiguous.

## `FIELD_LENGTH`

Return the number of lanes in a field.

<!-- shape: FieldLength -->

| Field     | Required | Type                   | Meaning                                 |
| --------- | -------- | ---------------------- | --------------------------------------- |
| `kind`    | yes      | `"FIELD_LENGTH"`       | Expression discriminator.               |
| `operand` | yes      | `FieldValueExpression` | The field whose lane count is returned. |
| `type`    | yes      | `IntegerSet`           | The integer value-set of the result.    |

> [!info] Table: the properties of the `FIELD_LENGTH` node

<!-- /shape: FieldLength -->

When the operand has a fixed length, the result type `MUST` be the singleton integer set containing that length. Otherwise, it `MUST` be an integer set whose minimum is 0.

## `FIELD_LANE`

Return the truthvalue at a zero-based displayed-sequence index.

<!-- shape: FieldLane -->

| Field     | Required | Type                     | Meaning                               |
| --------- | -------- | ------------------------ | ------------------------------------- |
| `kind`    | yes      | `"FIELD_LANE"`           | Expression discriminator.             |
| `operand` | yes      | `FieldValueExpression`   | The field to inspect.                 |
| `index`   | yes      | `IntegerValueExpression` | Zero-based index, with 0 at the left. |
| `type`    | yes      | `TruthvalueSet`          | Result truthvalue value-set.          |

> [!info] Table: the properties of the `FIELD_LANE` node

<!-- /shape: FieldLane -->

The index `MUST` satisfy `0 <= index < operand.length`. Binary lane results exclude `ambiguous`. Invalid dynamic indices panic.

## `FIELD_SLICE`

Return a field containing a contiguous sequence of lanes.

<!-- shape: FieldSlice -->

| Field     | Required | Type                     | Meaning                                  |
| --------- | -------- | ------------------------ | ---------------------------------------- |
| `kind`    | yes      | `"FIELD_SLICE"`          | Expression discriminator.                |
| `operand` | yes      | `FieldValueExpression`   | The source field.                        |
| `start`   | yes      | `IntegerValueExpression` | Zero-based displayed start index.        |
| `length`  | yes      | `IntegerValueExpression` | Number of lanes to select.               |
| `type`    | yes      | `FieldSet`               | Same field kind and selected lane count. |

> [!info] Table: the properties of the `FIELD_SLICE` node

<!-- /shape: FieldSlice -->

Both sizes `MUST` be non-negative, `start <= operand.length`, and `length <= operand.length - start`. An empty slice at the end is valid. Invalid dynamic ranges panic; they are not clamped or padded. When known statically, the frontend `MUST` include the selected length in the result type.

## `FIELD_CONCAT`

Return the left field's lanes followed by the right field's lanes.

<!-- shape: FieldConcat -->

| Field   | Required | Type                   | Meaning                                  |
| ------- | -------- | ---------------------- | ---------------------------------------- |
| `kind`  | yes      | `"FIELD_CONCAT"`       | Expression discriminator.                |
| `left`  | yes      | `FieldValueExpression` | The first lanes.                         |
| `right` | yes      | `FieldValueExpression` | The following lanes.                     |
| `type`  | yes      | `FieldSet`             | Same field kind and combined lane count. |

> [!info] Table: the properties of the `FIELD_CONCAT` node

<!-- /shape: FieldConcat -->

The operands and result `MUST` have the same field kind. Operand lengths may differ; the result length is their sum. When both lengths are known statically, the frontend `MUST` include their sum in the result type. Size overflow or allocation failure panics.

Slices and concatenations return owned field values without mutating their inputs. Backend storage boundaries do not affect any of these operations.

## Pointwise Operations

`FIELD_AND`, `FIELD_OR`, and `FIELD_XOR` apply their operation at each lane. `FIELD_XOR` is valid only for binary fields. `FIELD_ADJUST`, `FIELD_ROTATE_STATES`, and `FIELD_MODULATE` apply the corresponding truthvalue operation and are valid only for ternary fields.

<!-- shape: FieldBinaryOperation -->

| Field   | Required | Type                                                                                                                                     | Meaning                                              |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `kind`  | yes      | <code>"FIELD_AND" &#124; "FIELD_OR" &#124; "FIELD_XOR" &#124; "FIELD_ADJUST" &#124; "FIELD_ROTATE_STATES" &#124; "FIELD_MODULATE"</code> | The pointwise operation to apply.                    |
| `left`  | yes      | `FieldValueExpression`                                                                                                                   | The left field operand.                              |
| `right` | yes      | `FieldValueExpression`                                                                                                                   | The right field operand.                             |
| `type`  | yes      | `FieldSet`                                                                                                                               | The result field kind and optional exact lane count. |

> [!info] Table: the properties of the `FieldBinaryOperation` node

<!-- /shape: FieldBinaryOperation -->

The left operand, right operand, and result `MUST` have the same field kind and lane count. A backend must preserve lane order and apply each operation to corresponding lanes.

Field equality and inequality use the generic `EQUAL` and `NOT_EQUAL` nodes, not a field-specific expression.

## `FIELD_SHIFT_LEFT` and `FIELD_SHIFT_RIGHT`

Shift a field by the integer lane count in the right operand.

<!-- shape: FieldShift -->

| Field   | Required | Type                                                       | Meaning                                              |
| ------- | -------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| `kind`  | yes      | <code>"FIELD_SHIFT_LEFT" &#124; "FIELD_SHIFT_RIGHT"</code> | The direction in which lanes are shifted.            |
| `left`  | yes      | `FieldValueExpression`                                     | The field to shift.                                  |
| `right` | yes      | `IntegerValueExpression`                                   | The integer number of lanes to shift.                |
| `type`  | yes      | `FieldSet`                                                 | The result field kind and optional exact lane count. |

> [!info] Table: the properties of the `FieldShift` node

<!-- /shape: FieldShift -->

The result `MUST` have the same field kind and lane count as the left operand. Lanes shifted out are discarded, and vacated lanes are `false`. A negative count is invalid; shifting by at least the field length yields an all-`false` result.

## Example

```json
{
  "kind": "FIELD_FROM_STRING",
  "value": {
    "kind": "STRING_LITERAL",
    "type": { "universe": "string", "value": "1010" }
  },
  "type": { "universe": "bitfield", "length": 4 }
}
```

## Rules for Frontend

- Field operands and results `MUST` use unboxed field value-sets.
- The frontend `MUST` emit a field kind and length consistent with the operation; constraints known to be invalid `MUST` be reported during compilation.
- `FIELD_LENGTH` `MUST` have an integer result value-set.
- `FIELD_LANE` `MUST` have a truthvalue result value-set.

## Rules for Backend

- The backend `MUST` implement the specified lane mapping, operation, and sequence order independently of its internal representation.
- The backend `MUST` reject invalid dynamic lane strings, negative shift counts, invalid lane indices or slice ranges, and operations whose runtime lane kinds or lengths are incompatible. Converting indices and slice sizes to storage sizes `MUST NOT` silently truncate, wrap, or saturate.
