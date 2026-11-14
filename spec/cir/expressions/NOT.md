&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Expressions](./README.md)

# `NOT`

Negate a three-valued truth value.

<!-- shape: LogicalNot -->

| Field     | Required | Type                   | Meaning                           |
| --------- | -------- | ---------------------- | --------------------------------- |
| `kind`    | yes      | `"NOT"`                | Expression discriminator.         |
| `operand` | yes      | `TruthvalueExpression` | The truth value to negate.        |
| `type`    | yes      | `UnboxedTruthvalueSet` | Possible results of the negation. |

> [!info] Table: the properties of the `NOT` node

<!-- /shape: LogicalNot -->

The definition is in [expressions.json](../schema/expressions.json).

## Rules for Frontend

- `operand` and the result `type` `MUST` have unboxed `truthvalue` value-sets.
- The result value-set `MUST` cover the negation of every possible operand value.

## Rules for Backend

Evaluate the operand once and return the following result:

| Operand | Result |
| ------- | ------ |
| `false` | `true` |
| `ambiguous` | `ambiguous` |
| `true` | `false` |

This is not a two-valued Boolean test: negating `ambiguous` does not produce `true`.

## Example

```json
{
  "kind": "NOT",
  "operand": {
    "kind": "TRUTHVALUE_LITERAL",
    "type": { "universe": "truthvalue", "value": "ambiguous" }
  },
  "type": { "universe": "truthvalue", "value": "ambiguous" }
}
```
