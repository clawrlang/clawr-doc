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

## Field literals

Prefixed literals construct fields, not integers:

```clawr
const flags = 0b0001                    // bitfield(4)
const states = 0tT01_T01_T01            // tritfield(9)
const octets = 0x00_80_FF_01            // bitfield(32)
const same: bitfield(8) = 0b0000_1111
const also: bitfield(8) = 0x0F
```

- `0b` accepts binary lanes `0` and `1`; its inferred length is the number of digits.
- `0t` accepts ternary lanes `T`, `0`, and `1`, meaning `false`, `ambiguous`, and `true`; its inferred length is the number of digits.
- `0x` accepts hexadecimal digits `0` through `9`, `a` through `f`, and `A` through `F`. Each digit expands to four binary lanes, most significant first, so its inferred length is four times the number of digits.
- Prefixes are lowercase. A single underscore may separate adjacent digits; underscores do not contribute lanes or establish algorithmic chunk boundaries.
- Leading zeroes are preserved. Index 0 is the leftmost expanded lane. For example, `0x01` has eight lanes and equals `0b00000001`, not `0b1`.
- At least one digit is required. Invalid digits, misplaced underscores, and incompatible declared lengths are compile-time errors. Use `bitfield("")` or `tritfield("")` for empty fields.

Literal widths need not be multiples of eight or match a machine word. Octet alignment is a requirement of the octet output encoding, not field construction. Literals do not depend on function-name resolution; a user-defined function named `bitfield` or `tritfield` does not change their meaning. String constructors remain available for dynamic input.

## Operations

`fieldLength(field)` returns the lane count as an `integer`.

### Lane access, slicing, and concatenation

- `fieldLane(field, index)` returns the `truthvalue` at a zero-based displayed-sequence index. Index 0 is the leftmost lane. A binary field can return only `false` or `true`; a ternary field can also return `ambiguous`.
- `fieldSlice(field, start, length)` returns a field of the same kind containing `length` lanes beginning at `start`. The selected range excludes `start + length`. Both arguments are non-negative integers; `start` may equal the field length only when selecting zero lanes.
- `fieldConcat(left, right)` returns the lanes of `left` followed by the lanes of `right`. The fields must have the same kind, but need not have the same length. Empty fields are valid operands.

These operations do not mutate their inputs. Slices and concatenations are field values, not views or physical buffers. Their lengths are independent of backend word boundaries.

```clawr
const flags = bitfield("1001")
const first = fieldLane(flags, 0)                  // true
const middle: bitfield(2) = fieldSlice(flags, 1, 2) // 00
const joined: bitfield(3) = fieldConcat(middle, bitfield("1"))
const empty: bitfield(0) = fieldSlice(flags, 4, 0)
```

The frontend `MUST` reject a non-integer index or count, incompatible field kinds, and bounds it can determine to be invalid. Remaining bounds and length checks happen at runtime; invalid input or an unrepresentable result size causes a panic. Indices and counts are never silently clamped, wrapped, or truncated. In particular, lane access requires `index < fieldLength(field)`, while slicing requires `start <= fieldLength(field)` and `length <= fieldLength(field) - start`. When known statically, the result type includes the exact slice or concatenation length.

### Pointwise operations and shifts

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

The initial [octet file-stream API](../../stdlib/README.md#octet-file-streams)
maps each octet to eight binary lanes, MSB-first. It rejects non-aligned writes
instead of silently padding them. This is one explicit encoding, not an
intrinsic byte order for all fields; ternary encodings remain separate.

The current scope and deferred design questions are recorded in [ADR-041](../../../adr/adr-041.md).
