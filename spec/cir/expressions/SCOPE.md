&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Expressions](./README.md)

# `SCOPE`

Evaluate statements in a local scope, compute a value, then perform cleanup. This lets the frontend express temporary bindings and conditional evaluation within an expression.

<!-- shape: ScopedExpression -->

| Field        | Required | Type          | Meaning                                                        |
| ------------ | -------- | ------------- | -------------------------------------------------------------- |
| `kind`       | yes      | `"SCOPE"`     | Expression discriminator.                                      |
| `statements` | yes      | `Statement[]` | Statements evaluated in order before the value.                |
| `value`      | yes      | `Expression`  | The result evaluated before cleanup.                           |
| `cleanup`    | yes      | `Release[]`   | Releases evaluated after the value and before the scope exits. |
| `type`       | yes      | `ValueSet`    | The value-set of the resulting expression.                     |

> [!info] Table: the properties of the `SCOPE` node

<!-- /shape: ScopedExpression -->

The definition is in [expressions.json](../schema/expressions.json).

## Rules for Frontend

- Names declared by `statements` are local to the scope. `value` and `cleanup` can use them.
- `type` `MUST` cover every possible result of `value`.
- Cleanup `MUST NOT` invalidate the result before its consumer can use it. Ownership follows [Automatic Reference Counting](../arc.md).

## Rules for Backend

- Execute `statements` in order, then evaluate `value` once and preserve its result.
- Execute `cleanup` after computing the value and before exiting the scope.
- Yield the preserved result. Do not expose local bindings outside the scope.
- If a statement returns from the enclosing function, preserve that early exit rather than continuing to evaluate `value`.

## Short-Circuit Evaluation

Source `left && right` can be represented as:

1. Save `left` in a temporary.
2. Use [`IF`](../statements/IF.md) to evaluate `right` and assign the eager `AND` result only when the temporary is not `false`.
3. Yield the temporary.

For `||`, skip the right operand only when the temporary is `true`. An `ambiguous` left operand requires evaluation of the right operand in both cases. See [logic nodes](./AND-OR.md).

## Example

```json
{
  "kind": "SCOPE",
  "statements": [
    {
      "kind": "VARIABLE_DECL",
      "name": "temporary",
      "type": { "universe": "integer", "value": "7" },
      "initialValue": {
        "kind": "INTEGER_LITERAL",
        "type": { "universe": "integer", "value": "7" }
      }
    }
  ],
  "value": {
    "kind": "VARIABLE_REF",
    "name": "temporary",
    "type": { "universe": "integer", "value": "7" }
  },
  "cleanup": [],
  "type": { "universe": "integer", "value": "7" }
}
```

This evaluates to 7. The local name `temporary` is not visible to the surrounding expression. No ARC cleanup is needed for this unboxed integer.
