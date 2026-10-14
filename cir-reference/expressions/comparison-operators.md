<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Comparison Operators

Comparison is a union of three families. Every family shares the same
shape — `kind`, `left`, `right` and `type`. 

| Field   | Required | Type         | Meaning                     |
| ------- | -------- | ------------ | --------------------------- |
| `kind`  | yes      | string       | Declaration discriminator.  |
| `left`  | yes      | `Expression` | The left operand.           |
| `right` | yes      | `Expression` | The right operand.          |
| `type`  | yes      | `BooleanSet` | The type of the expression. |

> [!info] Table: common properties of comparison operator nodes

The `kind` discriminator identifies the actual operation.

| Family               | Kinds                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| Equality             | <code>"EQUAL" &#124; "NOT_EQUAL"</code>                                                                   |
| Ordering             | <code>"GREATER_THAN" &#124; "GREATER_THAN_OR_EQUAL" &#124; "LESS_THAN" &#124; "LESS_THAN_OR_EQUAL"</code> |
| Referential Equality | <code>"NOT_SAME" &#124; "SAME"</code>                                                                     |


The Equality family tests for semantic equality, while the Referential Equality applies only to `SHARED` entities. Two `ISOLATED` variables are by definition not the same entity even if they happen to point to the same memory address.

The Ordering family applies to `integer` and `real` values as well as values that conform to the `Ordered` trait (not yet implemented).

# Rules for Frontend

- The expression types `MUST` be limited to Boolean values. Comparing two values `MUST NOT` yield `ambiguous`.

# Rules for Backend

-

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
