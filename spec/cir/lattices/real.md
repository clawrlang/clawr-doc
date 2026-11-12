&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Lattices](./README.md)

# `real`

A range of real values. A constant integer (e.g. a `const` variable or a literal) will have `min` = `max`, equal to the constant itself. Other value-sets may skip either the `min`, `max` or both properties.

If either or both limits is excluded, the value could be any real number (ℝ), and the backend `MUST` use arbitrary precision to store the value. If both limits are set, the backend `MAY` use an optimised storage type for the value.

The schema accepts either a bounded/unbounded range or a singleton value:

<!-- shape: RealSet -->

| Field       | Required | Type            | Meaning                                   |
| ----------- | -------- | --------------- | ----------------------------------------- |
| `universe`  | yes      | `"real"`        | Declaration discriminator.                |
| `boxed`     | no       | `true`          | Present if the value is boxed.            |
| `precision` | no       | `RealPrecision` | The required precision in storage.        |
| `min`       | no       | `string`        | The lower bound of the range (inclusive). |
| `max`       | no       | `string`        | The upper bound of the range (inclusive). |
| `value`     | no       | `string`        | The single value of the set.              |

> [!info] Table: the properties of the `real` node

<!-- /shape: RealSet -->

<!-- shape: RealPrecision -->

| Field    | Required | Type                                         | Meaning                                                                                 |
| -------- | -------- | -------------------------------------------- | --------------------------------------------------------------------------------------- |
| `kind`   | yes      | <code>"scale" &#124; "sig"</code>            | The kind of precision requirement: number of significant digits or number of “decimals” |
| `digits` | yes      | `integer`                                    | The minimum number of digits in the specified base that must be stored correctly        |
| `base`   | yes      | <code>"dec" &#124; "bin" &#124; "ter"</code> | The base — 2 (bin), 3 (ter) or 10 (dec) — for counting precision digits                 |

> [!info] Table: the properties of the `RealPrecision` node

<!-- /shape: RealPrecision -->

## Rules for Frontend

- Arithmetic operations mixing different precision bases (`dec`, `bin`, `ter`) `MUST` be rejected unless an explicit conversion via `round(x, to: ...)` is provided. An exact decimal literal `MAY` adopt the other operand’s precision and base.
- Assignment `MUST` round to the destination’s declared precision if it differs from the precision of the operation result. The precision of each operation result is derived from its operands, as specified by [ADR-027](../../../adr/adr-027.md).

## Rules for Backend

- `dec`: the storage and representation `MUST` be base 10, such as a decimal significand and exponent, preserving decimal-exact behaviour over the declared range (so that, for example, `0.1 + 0.2 == 0.3` where the precision permits). Unbounded ranges need a scalable exponent. Bounded ranges `MAY` use finite exponent formats consistent with their $x_{\text{guarantee}}$.
- `bin` and `ter`: the storage base is backend-defined. A bounded `sig` value `MAY` be lowered to any representation that delivers at least the requested number of significant digits at and above $x_{\text{guarantee}}$; precision `MAY` be reduced below it. Unbounded ranges need a scalable exponent.
- `scale`: values `MUST` be lowered using an integer numerator corresponding to $b^{-n}$. The numerator `MAY` grow as needed, subject to available memory.
- Every real-valued arithmetic operation rounds its result to the precision derived from its operands; exact intermediates are not required. Each operation’s rounding point `MUST` be preserved. Reassociation, contraction into fused operations and other optimizations that remove a rounding step `MUST NOT` be applied unless they preserve the same observable result.
- Conversions across bases require explicit lowering steps in the backend’s runtime or in generated conversion routines.

The rationale is documented in [ADR-031](../../../adr/adr-031.md).
