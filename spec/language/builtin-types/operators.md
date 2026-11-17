&nbsp; / &nbsp; [The Clawr Language](../README.md) &nbsp; / &nbsp; [Built-in Types](./README.md)

[The Clawr Language](../README.md) / [Built-in Types](./README.md)

# Operators

Operators at the same precedence level group left to right, except `^`, which
groups right to left, and comparisons, which are non-associative. Chained
comparisons require parentheses.

From lowest to highest precedence:

1. Logical OR: `||`
2. Logical AND: `&&`
3. Comparisons: `==`, `===`, `!=`, `!==`, `>`, `<`, `<=`, `>=`, `≤`, `≥`, `≠`
4. Field OR: `|`
5. Field AND: `&`
6. Shifts: `<<`, `>>`
7. Addition and subtraction: `+`, `-`
8. Multiplication and division: `*`, `/`
9. Exponentiation and binary-field XOR: `^`
10. Postfix member access and calls: `.`, `->`, `()`
11. Prefix operators, including `!`
12. Parentheses, literals, and identifiers

On binary fields, `^` is XOR and uses the same precedence and right
associativity as numeric exponentiation. Thus `a & b ^ c` groups as
`a & (b ^ c)`. Ternary fields do not support `^`; see [Fields](./fields.md).

Logical operators use [truthvalue semantics](./truthvalue.md#logical-operators).
Source-level `&&` and `||` short-circuit; see [Control Flow](../control-flow.md).
Arithmetic operators apply to `integer` and `real` values. If both operands are
integers, the result is an integer; if either operand is real, the result is a
real. See [`integer`](./integer.md) and [`real`](./real.md) for arithmetic
constraints.
