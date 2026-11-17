&nbsp; / &nbsp; [The Clawr Language](../README.md) &nbsp; / &nbsp; [Built-in Types in Clawr](./README.md)

# `truthvalue`

The `truthvalue` type represents a value with three possible states: `false`, `ambiguous`, and `true`.

The `truthvalue` type can be thought of as an extension of the traditional boolean type, with an additional `ambiguous` state to represent uncertainty. In fact, `boolean` is defined as a `subset` of `truthvalue` containing only `false` and `true`.

```clawr
subset boolean = truthvalue (false|true)
```

## Usage as a Control Flow Condition

A `truthvalue` can be used in logical expressions and control flow statements. The `ambiguous` state is considered “not true.” The NOT operator (`!`) will invert `true` to `false`, `false` to `true`, but leave `ambiguous` unchanged.

```clawr
mut condition: truthvalue

if condition {
    // Handle the true case
} else if !condition {
    // Handle the false case
} else {
    // Handle the ambiguous case
}
```

## Logical Operators

The `truthvalue` type supports standard logical operators: AND (`&&`), OR (`||`), and NOT (`!`). They can be described as follows:

- `&&` (AND) returns the least truthy value among its operands.
- `||` (OR) returns the most truthy value among its operands.
- `!` (NOT) inverts the truth value: `true` becomes `false`, `false` becomes `true`, and `ambiguous` remains `ambiguous`.
- Equality is two-valued: comparing a value with itself, including `ambiguous`, returns `true`.
- Source evaluation short-circuits `true || right` and `false && right`. An `ambiguous` left operand does not short-circuit either operator.

There are also three logical functions in the standard library that are unavailable for binary Boolean operations:

```clawr
func rotate(_ value: truthvalue, by: truthvalue) -> truthvalue
func adjust(_ value: truthvalue, towards: truthvalue) -> truthvalue
func modulate(_ value: truthvalue, by: truthvalue) -> truthvalue
```

The `rotate(_:,by:)` function increments the input value by one step if the `by:` argument is `true`, decrements it by one step if the `by:` argument is `false`, and leaves it unchanged if the `by` argument is `ambiguous`. If the value is already at the extreme (`true` or `false`), it rolls over to the opposite extreme.

The `adjust(_:,towards:)` function moves the truth value one step in the direction of the `towards:` argument, unless the `towards:` argument is `ambiguous`, in which case it leaves the value unchanged. If the value is already at the target extreme (`true` or `false`), it remains at that extreme.

The `modulate(_:,by:)` function flips the input value if the `by:` argument is `false`, retains the input value if the `by:` argument is `true`, and sets it to `ambiguous` if the `by:` argument is `ambiguous`.

### Alternative Interpretations

The `truthvalue` values can be interpreted numerically as `false = -1`, `ambiguous = 0`, and `true = 1`. In this representation, the logical operations can be understood as standard arithmetic operations on these numeric values.

- Logical AND (`&&`) can be understood as taking the minimum: `A && B = min(A, B)`
- Logical OR (`||`) can be understood as taking the maximum: `A || B = max(A, B)`
- Logical NOT (`!`) can be understood as the negation of the numeric value: `!A = -A`
- The `rotate(_:,by:)` operation can be understood as modular addition: `rotate(A, by: B) = (A + B) % 3` (where $2 \equiv -1 \pmod{3}$, corresponding to `false`).
- The `adjust(_:,towards:)` operation can be understood as clamped addition: `adjust(A, towards: B) = clamp(A + B, min: -1, max: 1)`.
- Logical `modulate(_:,by:)` can be understood as the multiplication of the numeric values: `modulate(A, by: B) = A * B`

## Truth Tables

`A && B` Truth Table:

| `A`       | `B`       | `A && B`  |
| --------- | --------- | --------- |
| false     | false     | false     |
| false     | ambiguous | false     |
| false     | true      | false     |
| ambiguous | false     | false     |
| ambiguous | ambiguous | ambiguous |
| ambiguous | true      | ambiguous |
| true      | false     | false     |
| true      | ambiguous | ambiguous |
| true      | true      | true      |

`A || B` Truth Table:

| `A`       | `B`       | <code>A &#124;&#124; B</code> |
| --------- | --------- | ----------------------------- |
| false     | false     | false                         |
| false     | ambiguous | ambiguous                     |
| false     | true      | true                          |
| ambiguous | false     | ambiguous                     |
| ambiguous | ambiguous | ambiguous                     |
| ambiguous | true      | true                          |
| true      | false     | true                          |
| true      | ambiguous | true                          |
| true      | true      | true                          |

`!A` Truth Table:

| `A`       | `!A`      |
| --------- | --------- |
| false     | true      |
| ambiguous | ambiguous |
| true      | false     |

`rotate(_:,by:)` Truth Table:

| `A`       | `B`       | `rotate(A, by: B)` |
| --------- | --------- | ------------------ |
| false     | false     | true               |
| false     | ambiguous | false              |
| false     | true      | ambiguous          |
| ambiguous | false     | false              |
| ambiguous | ambiguous | ambiguous          |
| ambiguous | true      | true               |
| true      | false     | ambiguous          |
| true      | ambiguous | true               |
| true      | true      | false              |

`adjust(_:,towards:)` Truth Table:

| `A`       | `B`       | `adjust(A, by: B)` |
| --------- | --------- | ------------------ |
| false     | false     | false              |
| false     | ambiguous | false              |
| false     | true      | ambiguous          |
| ambiguous | false     | false              |
| ambiguous | ambiguous | ambiguous          |
| ambiguous | true      | true               |
| true      | false     | ambiguous          |
| true      | ambiguous | true               |
| true      | true      | true               |

`modulate(_:,by:)` Truth Table:

| `A`       | `B`       | `modulate(A, by: B)` |
| --------- | --------- | -------------------- |
| false     | false     | true                 |
| false     | ambiguous | ambiguous            |
| false     | true      | false                |
| ambiguous | false     | ambiguous            |
| ambiguous | ambiguous | ambiguous            |
| ambiguous | true      | ambiguous            |
| true      | false     | false                |
| true      | ambiguous | ambiguous            |
| true      | true      | true                 |
