&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Expressions](./README.md)

# Logic Operators

Clawr’s three-valued logic is closely related to Kleene K3, but `ambiguous == ambiguous` is `true` (see [Logic Operators](../../language/types.md#logic-operators)). A `truthvalue` is either `false`, `ambiguous` or `true`. The operations `AND` and `OR` have meaningful behaviours that translate cleanly between Boolean logic and this model.

There are several ternary-only operations, but they are implemented as functions, not operators.

<!-- shape: LogicalOperation -->

| Field   | Required | Type                           | Meaning                     |
| ------- | -------- | ------------------------------ | --------------------------- |
| `kind`  | yes      | <code>"AND" &#124; "OR"</code> | Declaration discriminator.  |
| `left`  | yes      | `Expression`                   | The left operand.           |
| `right` | yes      | `Expression`                   | The right operand.          |
| `type`  | yes      | `TruthvalueSet`                | The type of the expression. |

> [!info] Table: the properties of the `LogicalOperation` node

<!-- /shape: LogicalOperation -->

The logic operators return the most false value (`AND`) and the most true value (`OR`) respectively of the two operands. The `ambiguous` value is more true than `false`, but more false than `true`.

Alternatively: think of `AND` as `min(left, right)` and `OR` as `max(left, right)` if the `truthvalue` values are ordered `false < ambiguous < true`.

## Rules for Frontend

- Operands and the result `MAY` include the `ambiguous` value.
- The frontend `MUST` preserve [source-level short-circuiting](../../language/types.md#logic-operators) using explicit control flow, such as [`SCOPE`](./SCOPE.md) and [`IF`](../statements/IF.md). It `MUST NOT` rely on `AND` or `OR` to skip an operand.

## Rules for Backend

- Both operand expressions `MUST` be evaluated. `AND` and `OR` are eager CIR operations, not short-circuit operators.
- Produce the three-valued result described above. Optimizations `MUST` preserve observable effects of operand evaluation.
- The backend `MAY` optimize lowering if one operand is statically known to be `false` for `AND` or `true` for `OR`, as long as it preserves the observable effects of operand evaluation.
- The backend `MAY` implement further optimizations, treating values as simple Booleans, if their `type` is statically known to exclude the `ambiguous` value.
