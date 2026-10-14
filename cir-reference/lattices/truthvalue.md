<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `truthvalue`

[CIR](../README.md) : [Lattices](./README.md)

A set of truth-values.

Rather than a simple Boolean type, Clawr considers a three-valued truth:

<!-- shape: TruthvalueSet -->

| Field      | Required | Type           | Meaning                        |
| ---------- | -------- | -------------- | ------------------------------ |
| `universe` | yes      | `"truthvalue"` | Declaration discriminator.     |
| `boxed`    | no       | `true`         | Present if the value is boxed. |
| `values`   | no       | `Boolean[]`    | The values in the set.         |
| `value`    | no       | `Truthvalue`   | The single value in the set.   |

> [!info] Table: the properties of the `truthvalue` node

<!-- /shape: TruthvalueSet -->

There is still a `boolean` “type,” but it is not a type in the same way as ordinary languages define it. Instead it is a `subset` to the `truthvalue` lattice's top set.

```clawr
subset boolean = truthvalue(false|true)
```

This means that all `boolean` values are in reality `truthvalue` values. They are simply restricted to the values `true` and `false`. This could perhaps be used to simplify conditions at runtime. I leave the exercise to the backend developer.

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
