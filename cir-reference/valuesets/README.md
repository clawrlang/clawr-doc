<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# ValueSets

[CIR](../README.md)

Clawr considers types as sets and lattices. Every variable has a set of values that it may store, functions have a set of possible result values, and so on. Every expression has a value-set too, though that is not exposed in the CIR at this time.

## `integer`

An [`integer`](./integer.md) value-set is either the entire infinite mathematical set “the integers” (ℤ) or a subset of ℤ defined as a range.

```ts
type IntegerValueSet = {
  type: 'integer'
  min?: `${bigint}`
  max?: `${bigint}`
}
```

[Click here](./integer.md) for more details

## `real`

An [`real`](./real.md) value-set is either the entire infinite mathematical set “the reals” (ℝ) or a subset of ℝ defined as a range.

```ts
type RealValueSet = {
  type: 'real'
  min?: string // numeric, can be arbitrarity big
  max?: string // numeric, can be arbitrarity big
}
```

A range of real values. A constant integer (e.g. a `const` variable or a literal) will have `min` = `max`, equal to the constant itself. Other value-sets may skip either the `min`, `max` or both properties.

If either or both limits is excluded, the value could be any real number (ℝ), and the backend `MUST` use arbitrary precision to store the value. If both limits are set, the backend `MAY` use an optimised storage type for the value.

## `truthvalue`

```ts
type TruthValueSet = {
  type: 'truthvalue'
  values: ('false' | 'ambiguous' | 'true')[]
}
```

A set of truth values.

## `string`

```ts
type StringValueSet = { type: 'string' }
```

An unconstrained string value.

### Custom `data` Structures

```ts
type RcTypeValueSet = {
  type: 'rc-type'
  namespace?: string
  typeName: string
}
```

A set allowing all instances of a reference counted type (including inheritance). The `typeName` `MUST` identify a type that is available in the current scope.

The `semantics` property identifies whether the value is a `SHARED` entity or meant for `ISOLATED` variables.

<script>
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  }
};
</script>
<script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
</script>
