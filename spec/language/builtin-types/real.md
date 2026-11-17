&nbsp; / &nbsp; [The Clawr Language](../README.md) &nbsp; / &nbsp; [Built-in Types in Clawr](./README.md)

# `real`

The `real` type represents an arbitrarily sized numeric value of unspecified precision. Like `integer`, `real` supports defining `subset`s as bounded ranges. A `real` `subset` is, however, not a complete and meaningful type. To be well-defined, and capable of meaningful storage and computation, every complete `real` type must have an explicitly specified precision.

## Subsets

A `real` `subset` defines a range of valid values for a `real` type. It is specified like an `integer` `subset` using lower and upper bounds, which can be finite or infinite. For example:

```clawr
subset probability = real(0.0...1.0)
```

Here, `probability` is a `subset` of `real` that only includes values between 0 and 1. Note that a `subset` alone does not define a complete `real` type; it must be combined with a precision specification to be meaningful.

```clawr
const x: probability scale 5 dec = 0.5 // 50.000%
```

## Precision and Representation

The precision of a `real` value is specified as a number of digits in a given base 2 (`bin`), 3 (`ter`), or 10 (`dec`). The precision is either measured in significant digits (`sig`) or a fixed number of fractional digits after the demarcation point (`scale`).

The choice of base affects how the precision is interpreted and how rounding is performed.

### Precision in Parameters

A formal parameter may declare `real` without specifying precision. It accepts
a real value while preserving its incoming precision, so passing or forwarding
the parameter does not round it. Arithmetic still requires known precision,
and stored values and declared function results still require explicit
precision. See [Function Parameters](../semantics/function-parameters.md).

> [!note] Base 3 is Considered Niche
>
> As most contemporary developers are unused to base 3 arithmetics, the `ter` base is not expected to be widely used.
>
> It was added in anticipation of ternary hardware, which may become more common in the future. The Clawr language is designed to be agnostic to platform specifics, including the underlying numerical base.

### `sig`

The `sig` precision indicates the minimum number of significant digits that must be maintained in all calculations. For example, `sig 10 dec` maintains at least 10 significant decimal digits, while `sig 10 bin` maintains 10 or more significant binary digits.

Operations `MAY` round intermediate results at any digit position beyond the minimum required by the `sig` precision. In other words, intermediate calculations are allowed to store many more digits (even if they may be suspect) than the specified minimum, but they `MUST NOT` fall below it.

> [!warning]
>
> The precision is only guaranteed for “normal” values. For very small numbers close to zero, the actual precision may be lower than specified due to underflow and rounding effects.
>
> In practice, however, the representation might use an arbitrary number of extra digits internally to improve accuracy, even though only the minimum specified by the `sig` precision is guaranteed. [^no-representation]

[^no-representation]:
    This means that a developer cannot explicitly choose the underlying representation.

    Clawr is designed to turn the programmer's concern away from technical details to focus instead on the complexities of their application’s domain. If they do not trust the compiler to make good choices or just prefer to focus on the technology more than their domain, they will need to choose a different language that allows such control.

The precision is guaranteed as long as the value is larger than a threshold value defined as:

$$x_{\text{guarantee}} = \min\!\left({M \over b^{2n}},\ \frac{b^2}{M}\right)$$

Here, $M$ represents the largest magnitude of the specified range, $b$ is the chosen base of the precision declaration, and $n$ is the number of significant digits specified by the `sig` property. Values smaller than $x_{\text{guarantee}}$ may not maintain the full specified precision.

This guarantee is enough to match the precision requirements of typical floating-point representations like IEEE 754, ensuring that values maintain the specified number of significant digits as long as they do not enter the subnormal range.

If using a `bin` precision requirement on a ternary system, the precision must still be guaranteed according to the formula for $x_{\text{guarantee}}$ with $b = 2$. Similarly, a `ter` precision requirement on a binary system would use $b = 3$ in the same formula. A type that was chosen to perfectly match a specific representation might need to use much more storage when running on a different base system.

### `scale`

The `scale` property of a `real` value indicates fixed-point precision, i.e., a fixed number of digits in the fractional part. For example, `scale 5 dec` specifies 5 digits after the base 10 decimal point.

Every operation on a `real scale n` value is rounded so that digits beyond the specified precision are discarded.

A `real scale n` value is in effect a rational number where the numerator is stored as an `integer` and the denominator is implicit from the type declaration. Specifically, a `scale n dec` type uses the denominator $10^n$. A `scale n bin` type uses the denominator $2^n$, and a `scale n ter` type uses $3^n$. In all three cases, the stored numerator can be arbitrarily large.

## Predefined IEEE 754 `type` Declarations

The `real` type includes predefined subtypes that conform to the IEEE 754 standard for floating-point arithmetic. These subtypes specify the precision and scale of the `real` values, ensuring consistent behavior across different platforms and backends. Examples include:

```clawr
type binary16 = real(-65504.0...65504.0) sig 11 bin
type binary32 = real(-340282346638528859811704183484516925440.0...340282346638528859811704183484516925440.0) sig 24 bin
type binary64 = real(-179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368.0...179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368.0) sig 53 bin
```

> [!note] No Predefined Ternary Types
>
> There is no ternary floating-point standard analogous to IEEE 754, so a predefined ternary type would be speculative and not very helpful.
> Users who wish to work with ternary arithmetics can still define their own `sig n ter` types as needed.

## Arithmetic Operators

- Arithmetics applies to `integer` and `real` operands. If both operands are `integer` the result is `integer`; if at least one is `real` the result is `real`.
- **Exponentiation** (`^`) does not allow `real` or negative `integer` exponents at this time.
- **Division** (`/`): the divisor `MUST NOT` be zero. If the type of the divisor explicitly specifies 0 as its max of min value, the frontend reports a compilation error. Otherwise, division by zero causes a runtime panic, which terminates the program.
- **Modulus** (`%`): returns the remainder after division: $n - \left\lfloor {n \over d} \right\rfloor \cdot d$. The magnitude of the result rotates through $\left [ 0, \lvert d \rvert \right )$ without jumps. The sign matches the divisor `d`.
