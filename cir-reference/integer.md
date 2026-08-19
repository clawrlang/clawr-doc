<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# [Clawr Intermediate Representation](./README.md) : ValueSet : `integer`

The `integer` value-set represents the (countably infinite) mathematical set known as “the integers” (typically depicted as ℤ).

```ts
type IntegerValueSet = {
  type: 'integer'
  min?: string
  max?: string
}
```

The value-set is unlimited by default, representing all of ℤ. An upper bound (`max`) and/or a lower bound (`min`) `MAY` be specified to limit the set of available values to a range.

The `max` and `min` values are base-10 encoded `string`s, not JSON `number`s. The largest integer safely represented as a JSON number is $2^{53}-1$, but an `integer` value-set must be able to represent values of arbitrary size, including e.g. $2^{64}-1$ (`uint64_t`), $3^{81} - 1 \over 2$ (81 bit balanced ternary). And (at least in theory) ridiculously large numbers like googol, Graham’s number [^in-theory] and beyond.

[^in-theory]: Yes, Graham's Number is eternally uncomputable and unrepresentable. It is ludicrous to even contemplate storing it, let alone try it in practice. Yet the specification as such does not preclude it.

The `max` and `min` bounds are both inclusive; a value is a member of the set if it is in the range $[\text{min}, \text{max}]$. If the value is known exactly (e.g. for a `const` variable or a literal), both bounds should indicate that value, resulting in a range with the size 1.

 In theory, any integer should be representable. [^memory] In practice, this means that an arbitrary-precision type will need to be used in runtime.

[^memory]: As long as there is enough memory available to store the value and enough time for processing the computations.

> [!question]
> Maybe the range should have an *exclusive* upper bound? The current format makes it impossible to represent an empty set. On the other hand, what are the bounds of an empty range? Maybe better to consider an empty set of `integer` an error?

## Rules for Frontend

- The `min` and `max` values (if included) `MUST` be encoded using base 10 and be integers.
- If both `min` and `max` are specified `min` `MUST` be numerically less than or equal to `max`.
- Static analysis `MUST` ensure that reported value-sets are never exceeded. Any case where that is not guaranteed `MUST` result in an error state before the CIR is handed to the backend.

## Rules for Backend

- A value-set with either or both `max` and `min` unset or `null` `MUST` be stored as an arbitrarily-sized integer.
- A value-set with both `max` and `min` set `MAY` be stored as a fixed-width integer, but the chosen storage type `MUST` support the entire range.
