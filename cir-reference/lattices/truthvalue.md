<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `truthvalue`

[CIR](../README.md) : [Lattices](./README.md)

A set of truth-values.

Rather than a simple Boolean type, Clawr considers a three-valued truth:

TypeScript declaration:

```ts
type TruthvalueLattice<Values extends truthvalue[]> = {
  type: 'truthvalue'
  values: Values
}

type truthvalue = 'false' | 'ambiguous' | 'true'
```

There is still a `boolean` “type,” but it is not a type in the same way as ordinary languages define it. Instead it is a `subset` (or sub-lattice) to the `truthvalue` top lattice.

```clawr
subset boolean = truthvalue(false|true)
```

This means that all `boolean` values are in reality `truthvalue` values. They are simply restricted to the values `true` and `false`. This could perhaps be used to simplify conditions at runtime. I leave the exercise to the backend developer.
