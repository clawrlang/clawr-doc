<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Binary Operators

## Equality

| Field   | Required | Type                                    | Meaning                     |
| ------- | -------- | --------------------------------------- | --------------------------- |
| `kind`  | yes      | <code>"EQUAL" &#124; "NOT_EQUAL"</code> | Declaration discriminator.  |
| `left`  | yes      | `Expression`                            | The left operand.           |
| `right` | yes      | `Expression`                            | The right operand.          |
| `type`  | yes      | `truthvalue`                            | The type of the expression. |

> [!info] Table: the properties of the `Equality` node

Values can only be either equal or not equal. The result `MUST` never be `ambiguous`.

## Ordering

| Field   | Required | Type                                                                                                      | Meaning                     |
| ------- | -------- | --------------------------------------------------------------------------------------------------------- | --------------------------- |
| `kind`  | yes      | <code>"GREATER_THAN" &#124; "GREATER_THAN_OR_EQUAL" &#124; "LESS_THAN" &#124; "LESS_THAN_OR_EQUAL"</code> | Declaration discriminator.  |
| `left`  | yes      | `Expression`                                                                                              | The left operand.           |
| `right` | yes      | `Expression`                                                                                              | The right operand.          |
| `type`  | yes      | `truthvalue`                                                                                              | The type of the expression. |

> [!info] Table: the properties of the `OrderComparison` node

Values can only be either less than or not less than etc. The result `MUST` never be `ambiguous`.

## Identity (by-ref) Equality

| Field   | Required | Type                                  | Meaning                     |
| ------- | -------- | ------------------------------------- | --------------------------- |
| `kind`  | yes      | <code>"NOT_SAME" &#124; "SAME"</code> | Declaration discriminator.  |
| `left`  | yes      | `Expression`                          | The left operand.           |
| `right` | yes      | `Expression`                          | The left operand.           |
| `type`  | yes      | `truthvalue`                          | The type of the expression. |

> [!info] Table: the properties of the `RefComparison` node

Entities can only either have the same address or not. The result `MUST` never be `ambiguous`.

## Logical Operations

| Field   | Required | Type                           | Meaning                     |
| ------- | -------- | ------------------------------ | --------------------------- |
| `kind`  | yes      | <code>"AND" &#124; "OR"</code> | Declaration discriminator.  |
| `left`  | yes      | `Expression`                   | The left operand.           |
| `right` | yes      | `Expression`                   | The right operand.          |
| `type`  | yes      | `truthvalue`                   | The type of the expression. |

> [!info] Table: the properties of the `LogicalOperation` node

## Arithmetics

| Field   | Required | Type                                                                                                                         | Meaning                     |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `kind`  | yes      | <code>"ADDITION" &#124; "DIVISION" &#124; "EXPONENTIAL" &#124; "MODULUS" &#124; "MULTIPLICATION" &#124; "SUBTRACTION"</code> | Declaration discriminator.  |
| `left`  | yes      | `Expression`                                                                                                                 | The left operand.           |
| `right` | yes      | `Expression`                                                                                                                 | The right operand.          |
| `type`  | yes      | <code>integer &#124; real</code>                                                                                             | The type of the expression. |

> [!info] Table: the properties of the `Arithmetic` node

Arithmetics on two `integer` operands yields an `integer` result. Operations on at lest one `real` value yields a `real` output.

The inputs `MAY` have mixed ranges. The backend `MUST` perform the operation in a way that matches both the operands' types AND the expression's type. There `MAY` be a need for many implementations and the backend `MUST` select the implementation itself.
