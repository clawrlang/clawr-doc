# Arithmetic Operators

Arithmetic operations on two `integer` operands yield `integer` results. Operations on at least one `real` value yield a `real` output.

The inputs `MAY` have mixed ranges. The backend `MUST` perform the operation in a way that matches both the operands' types AND the expression's type. There `MAY` be a need for many implementations and the backend `MUST` select the implementation itself.

<!-- shape: Arithmetic -->

| Field   | Required | Type                                                                                                                     | Meaning                     |
| ------- | -------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| `kind`  | yes      | <code>"ADDITION" &#124; "DIVISION" &#124; "POWER" &#124; "REMAINDER" &#124; "MULTIPLICATION" &#124; "SUBTRACTION"</code> | Declaration discriminator.  |
| `left`  | yes      | `Expression`                                                                                                             | The left operand.           |
| `right` | yes      | `Expression`                                                                                                             | The right operand.          |
| `type`  | yes      | <code>IntegerSet &#124; RealSet</code>                                                                                   | The type of the expression. |

> [!info] Table: the properties of the `Arithmetic` node

<!-- /shape: Arithmetic -->

# Rules for Frontend

- The input values `MAY` be arbitrarily large.
- The inputs `MAY` have mixed ranges.
- The inputs `MUST` be `integer` and/or `real` values.
- The inputs `MAY` be boxed.

# Rules for Backend

- The inputs can have mixed ranges. The backend `MUST` perform the operation in a way that matches both the operands' types AND the expression's type.
- There `MAY` be a need for multiple implementations for each operation and the backend `MUST` select the correct implementation based on the given types.
