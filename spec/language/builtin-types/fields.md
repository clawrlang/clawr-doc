&nbsp; / &nbsp; [The Clawr Language](../README.md) &nbsp; / &nbsp; [Built-in Types](./README.md)

# Binary and Ternary Fields

`bitfield` and `tritfield` are finite, ordered sequences of truth-value lanes. They are distinct value sets and do not depend on the machine's native word size or numeric base.

An unqualified field type permits any length. A length constraint denotes an exact number of lanes and is written with a non-negative integer literal:

```clawr
const flags: bitfield(4) = bitfield("1001")
const states: tritfield(3) = tritfield("T01")
```

The string constructor uses displayed order, with the first character at lane index 0. For `bitfield`, `0` means `false` and `1` means `true`. For `tritfield`, `T`, `0`, and `1` mean `false`, `ambiguous`, and `true`, respectively. Empty strings construct empty fields. These constructors do not define a wire format.

A constructor string containing a character outside the field's lane alphabet is invalid. The frontend `MUST` report invalid literal strings during compilation; invalid dynamic strings fail at runtime. A value assigned to a fixed-length field `MUST` have the declared number of lanes.

## Operations

`fieldLength(field)` returns the lane count as an `integer`.

The operators `&` and `|` apply pointwise to fields of the same kind and length. They use the corresponding truthvalue AND and OR rules. Prefix `!` applies truthvalue NOT to each lane. Binary fields also support pointwise XOR with `^`; ternary fields do not.

Ternary fields support pointwise state operations:

- `tritwiseAdjust(a, b)`
- `tritwiseRotate(a, b)`
- `tritwiseModulate(a, b)`

Each applies the corresponding [`truthvalue` operation](./truthvalue.md#logical-operators) to lanes at the same index. These operations change lane states, not lane positions.

The field helper calls use ordinary function resolution: a user-declared function with the same canonical name takes precedence over the built-in helper, regardless of its parameter value-sets.

The shift operators `<<` and `>>` move lanes in displayed sequence order. Lanes shifted out are discarded, and vacated lanes are filled with `false`. A non-negative shift of at least the field length produces an all-`false` field. A negative shift is invalid.

Equality and inequality require the same field kind and compare length and lane values in order. Fields of different lengths compare as unequal. Operations that pair corresponding lanes require equal kinds and lengths; the frontend `MUST` report a mismatch it can determine statically, and a mismatch only discoverable at runtime is a runtime error.

## Representation

Fields are not integers or physical buffers. Reading or writing them requires an explicit encoding that defines lane order, symbol mapping, framing, and malformed-input behavior. A backend may choose its internal representation, but that representation does not define a portable wire format.

The current scope and deferred design questions are recorded in [ADR-041](../../../adr/adr-041.md).
