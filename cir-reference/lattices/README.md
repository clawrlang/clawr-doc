<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Lattices

[CIR](../README.md)

Clawr considers types as sets and lattices. Every variable has a set of values that it may store, functions have a set of possible result values, and so on. Every expression has a value-set too, though that is not exposed in the CIR at this time.

## `integer`

An [`integer`](integer.md) value-set is either the entire infinite mathematical set “the integers” (ℤ) or a subset of ℤ defined as a range.

```ts
type IntegerLattice<
  Min extends bigint | undefined,
  Max extends bigint | undefined,
> = {
  type: 'integer'
} & (Min extends undefined
  ? { min?: undefined }
  : { min: `${Min}` & tags.Pattern<'^-?\\d+$'> }) &
  (Max extends undefined
    ? { max?: undefined }
    : { max: `${Max}` & tags.Pattern<'^-?\\d+$'> })
```

[Click here](integer.md) for more details

## `real`

An [`real`](real.md) value-set is either the entire infinite mathematical set “the reals” (ℝ) or a subset of ℝ defined as a range.

```ts
type RealLattice = {
  type: 'real'
  min?: string // numeric, can be arbitrarity big
  max?: string // numeric, can be arbitrarity big
}
```

[Click here](real.md) for more details

## `truthvalue`

The three values of three-valued (Kleene K3) truth.

```ts
type TruthvalueLattice<T extends truthvalue[]> = {
  type: 'truthvalue'
  values: T
}
```

[Click here](truthvalue.md) for more details

## `string`

An unconstrained string value.

```ts
type StringLattice = { type: 'string'; value?: string }
```

[Click here](string.md) for more details

## `rc-type`

A set allowing all instances of a reference counted type (including inheritance). The `name` `MUST` identify a type that is available in the current scope.

```ts
type RCTypeLattice = {
  type: 'rc-type'
  namespace?: string
  name: string
}
```

[Click here](rc-type.md) for more details
