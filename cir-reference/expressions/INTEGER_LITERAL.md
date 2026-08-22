<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `INTEGER_LITERAL`

[CIR](../README.md) : [Expressions](./README.md)

An `INTEGER_LITERAL` is a value in the (countably infinite) mathematical set known as “the integers” (typically depicted as ℤ). It may be arbitrarily large.

```ts
type IntegerLiteral<Value extends bigint> = {
  kind: 'INTEGER_LITERAL'
  value: IntegerLattice<Value, Value>
}
```

The `value` property is singleton set containing a single integer value (`max` == `min`).

# Rules for Frontend

- The `value` property `MUST` contain singleton set.
- The represented value `MAY` be arbitrarily large.

# Rules for Backend

- The value `MAY` be serialized as machine-code data if the value fits the physical representation.
- The value `MAY` be used to construct a reference-counted structure.
- If the value is too large for fixed-size representation it `MUST` be serialized as an arbitrarily sized integer.
- The physical representation is not limited to binary — or even ternary — but `MAY` use whichever base the target platform uses natively.
- The representation `MUST` unambiguously and faithfully represent the integer indicated by the `value` property.
