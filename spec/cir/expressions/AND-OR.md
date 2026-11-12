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

# Rules for Frontend

- The expression types (except logic) `MUST` be limited to Boolean values. Comparing two values `MUST NOT` yield `ambiguous`.

# Rules for Backend

- Evaluation `MUST` short-circuit `true || x` and `false && x`. If the left operand is `ambiguous`, neither operator can short-circuit.
