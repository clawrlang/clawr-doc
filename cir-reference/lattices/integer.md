<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `integer`

[CIR](../README.md) : [Lattices](./README.md)

The `integer` lattice represents the (countably infinite) mathematical set known as “the integers” (typically depicted as ℤ).

```ts
type IntegerLattice<Min extends bigint, Max extends bigint> = {
  type: 'integer'
  min?: `${Min}`
  max?: `${Max}`
}
```

The value-set is unlimited by default, representing all of ℤ. A limited subset can be created by specifying an upper bound (`max`) and/or a lower bound (`min`), thereby defining a range of values.

The `max` and `min` values are base-10 encoded `string`s, not JSON `number`s. The largest integer safely represented as a JSON number is $2^{53}-1$, but an `integer` value-set must be able to represent values of arbitrary size, including e.g. $2^{64}-1$ (max value of `uint64_t`), $3^{81} - 1 \over 2$ (81 bit balanced ternary), and (at least in theory) ridiculously large numbers like googol, googolplex and beyond.

The `max` and `min` bounds are both inclusive; a value is a member of the set if it is in the range $[\text{min}, \text{max}]$. If the value is known exactly (e.g. for a `const` variable or a literal), both bounds should indicate that value, resulting in a range with the size 1.

If `min` is not specified, the value-set is unlimited towards negative infinity. If `max` is unset, the set is unlimited towards positive infinity.

In theory, any integer should be representable. [^memory] In practice, this means that an arbitrary-precision representation will need to be used in runtime to store values.

[^memory]: As long as there is enough memory available to store the value and enough time for processing the computations.

## Rules for Frontend

- The `min` and `max` values (if included) `MUST` be encoded using base 10 and be integers.
- If both `min` and `max` are specified `min` `MUST` be numerically less than or equal to `max`.
- Static analysis `MUST` ensure that reported value-sets are never exceeded. Any case where that is not guaranteed `MUST` result in an error state before the CIR is handed to the backend.

## Rules for Backend

- A value-set with either or both `max` and `min` unset or `null` `MUST` be stored as an arbitrarily-sized integer.
- A value-set with both `max` and `min` set `MAY` be stored as a fixed-width integer, but the chosen storage size `MUST` support the entire range of values.

<script>
MathJax = { tex: { inlineMath: [['$', '$']] } };
</script>
<script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
</script>
