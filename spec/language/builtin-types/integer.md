&nbsp; / &nbsp; [The Clawr Language](../README.md) &nbsp; / &nbsp; [Built-in Types in Clawr](./README.md)

# `integer`

The `integer` universe represents whole numbers, both positive and negative, without any fractional component. It is a fundamental numeric type in Clawr and supports standard arithmetic operations such as addition, subtraction, multiplication, and division.

A type in the `integer` universe can be constrained to specific subsets, such as a range of values. Or it can be unbounded, allowing any value in $\mathbb{Z}$.

## Usage

An `integer` can be used in arithmetic expressions and assigned to variables. For example:

```clawr
mut x: integer = 5
mut y: integer = -3

const sum = x + y
const difference = x - y
const product = x * y
const quotient = x / y
```

## Arithmetic Operations

The `integer` type supports the following arithmetic operations:

- Addition (`+`): Adds two integers.
- Subtraction (`-`): Subtracts the second integer from the first.
- Multiplication (`*`): Multiplies two integers.
- Division (`/`): Divides the first integer by the second, performing integer division.
- Modulo (`%`): Returns the remainder of the division of the first integer by the second.

- Integer division rounds down to the nearest integer (floor division):
  `5 / 2` is `2`, and `-5 / 2` is `-3`.
- The divisor of `/` and `%` `MUST NOT` be zero. The frontend reports a known
  zero divisor; otherwise, the error is reported at runtime.
- The exponent in integer exponentiation (`^`) `MUST NOT` be negative. `0^0` is
  invalid; the frontend reports it when both operands are known, otherwise the
  error is reported at runtime.
- For `q = a / b`, the remainder is `a % b = a - b * q`. It is zero or has
  the sign of the divisor, and its magnitude is less than the divisor's
  magnitude. Thus a positive divisor gives a non-negative remainder; a
  negative divisor gives a non-positive remainder.

The rationale for floor division and its relationship to remainder is recorded
in [ADR-022](../../../adr/adr-022.md) and [ADR-023](../../../adr/adr-023.md).
