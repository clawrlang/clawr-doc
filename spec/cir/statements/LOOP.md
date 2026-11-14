&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Statements](./README.md)

# `LOOP`

Repeatedly execute a statement list with a pre-test or post-test condition.

<!-- shape: Loop -->

| Field       | Required | Type                   | Meaning                                                   |
| ----------- | -------- | ---------------------- | --------------------------------------------------------- |
| `kind`      | yes      | `"LOOP"`               | Statement discriminator.                                  |
| `condition` | yes      | `TruthvalueExpression` | Continues the loop only when true.                        |
| `body`      | yes      | `Statement[]`          | Statements executed on each iteration.                    |
| `testAfter` | yes      | `boolean`              | When true, test after the body; otherwise test before it. |

> [!info] Table: the properties of the `LOOP` node

<!-- /shape: Loop -->

The definition is in [statements.json](../schema/statements.json).

## Rules for Frontend

- `condition` `MUST` be an unboxed truthvalue expression.
- Emit `testAfter: false` for `while` and `testAfter: true` for `repeat`.
- Loop body declarations `MUST` remain local to each iteration; condition
  expressions cannot refer to them.
- Emit the required ownership operations on each iteration and every early
  return. Values used inside and after the loop `MUST` cover all reachable
  iterations and exits.

## Rules for Backend

- If `testAfter` is false, evaluate `condition` before each iteration. If true,
  execute the body once before evaluating it, and test again after each
  subsequent iteration.
- Execute another iteration only for `true`; `false` and `ambiguous` terminate
  the loop. Evaluate the condition once per test, in the specified order.
- Preserve the body scope, cleanup, and early-return behavior on each iteration.

## Example

```json
{
  "kind": "LOOP",
  "condition": {
    "kind": "TRUTHVALUE_LITERAL",
    "type": { "universe": "truthvalue", "value": "ambiguous" }
  },
  "body": [],
  "testAfter": true
}
```

The body executes once before the ambiguous condition terminates the loop.
