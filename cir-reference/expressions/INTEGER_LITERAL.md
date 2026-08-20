<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `INTEGER_LITERAL`

[CIR](../README.md) : [Expressions](./README.md)

An `INTEGER_LITERAL` is a value in the (countably infinite) mathematical set known as “the integers” (typically depicted as ℤ). It may be arbitrarily large.

```ts
type IntegerLiteral = {
  kind: 'INTEGER_LITERAL'
  value: `${bigint}`
}
```

The `value` property is a base-10 encoded `string`, not a JSON `number`. The largest integer safely represented as a JSON number is $2^{53}-1$, but an `INTEGER_LITERAL` must be able to represent values of arbitrary size, including values such as $2^{64}-1$ (max value of `uint64_t`), $±{3^{81} - 1 \over 2}$ (the range of 81 bit balanced ternary), and (at least in theory) ridiculously large numbers like googol, googolplex and beyond.

# Rules for Frontend

- The `value` property `MUST` contain a base-10 encoding of an integer value.
- The represented value `MAY` be arbitrarily large.

# Rules for Backend

- The value `MAY` be serialized as machine-code data if the value fits the physical representation.
- The value `MAY` be used to construct a reference-counted structure.
- If the value is too large for fixed-size representation it `MUST` be serialized as an arbitrarily sized integer.
- The physical representation is not limited to binary — or even ternary — but `MAY` use whichever base the target platform uses natively.
- The representation `MUST` unambiguously and faithfully represent the integer indicated by the `value` property.

## JSON Schema

```json
{
  "type": "object",
  "properties": {
    "kind": { "const": "INTEGER_LITERAL" },
    "value": { "type": "string", "pattern": "^-?\\d+$" }
  },
  "required": ["kind", "value"],
  "additionalProperties": false
}
´´´
