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

> [!note] Integer Division
>
> In Clawr, integer division always rounds down towards negative infinity, which may differ from some other programming languages that truncate towards zero.
>
> Examples:
>
> - `5 / 2` results in `2`
> - `-5 / 2` results in `-3`

The invariant that `MUST` always be satisfied for integer division and modulo is that if `m = a % b` and `q = a / b`, then $a = b \cdot q + m$. Therefore, the behavior of modulo operations are intrinsically linked to division, and vice versa.

Division always round down to the nearest smaller integer (mathematical floor division). For example, `5 / 2` results in `2`, and `-5 / 2` results in `-3` (because $\lfloor {-5 \over 2} \rfloor = -3$). The motivation behind this behavior is to maintain consistency when using modulo operations to rotate through values.

In languages that truncate towards zero instead of rounding down, a rotating view that moves to the left (smaller values) could unexpectedly jump to negative positions when using modulo operations. By consistently rounding towards negative infinity, Clawr ensures that modulo operations always result in non-negative values within the expected range.
