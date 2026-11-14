&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Statements](./README.md)

# `IF`

Conditionally execute one of two statement lists.

<!-- shape: If -->

| Field       | Required | Type                   | Meaning                                                       |
| ----------- | -------- | ---------------------- | ------------------------------------------------------------- |
| `kind`      | yes      | `"IF"`                 | Statement discriminator.                                      |
| `condition` | yes      | `TruthvalueExpression` | Selects the then branch only when true.                       |
| `then`      | yes      | `Statement[]`          | Statements executed when the condition is true.               |
| `otherwise` | no       | `Statement[]`          | Statements executed when the condition is false or ambiguous. |

> [!info] Table: the properties of the `IF` node

<!-- /shape: If -->

The definition is in [statements.json](../schema/statements.json). `otherwise` is optional; omitting it means that nothing executes when the condition is not `true`.

## Rules for Frontend

- `condition` `MUST` be an expression with an unboxed `truthvalue` value-set.
- Branch-local declarations `MUST` stay within their branch scope.
- The frontend `MUST` emit the ownership operations needed on each path, including when a branch returns early, according to [Automatic Reference Counting](../arc.md).
- Value-sets used after the conditional `MUST` cover all possible values on paths that reach that point.

## Rules for Backend

- Evaluate `condition` once. Execute `then` only if its value is `true`; for `false` or `ambiguous`, execute `otherwise` if present.
- Do not evaluate the unselected branch. Preserve the statement semantics and local scope of the selected branch, including early returns.

## Example

```json
{
  "kind": "IF",
  "condition": {
    "kind": "TRUTHVALUE_LITERAL",
    "type": { "universe": "truthvalue", "value": "ambiguous" }
  },
  "then": [],
  "otherwise": []
}
```

This selects `otherwise`, not `then`.
