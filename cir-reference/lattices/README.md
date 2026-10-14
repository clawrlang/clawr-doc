<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Lattices

[CIR](../README.md)

Clawr considers types as sets and lattices. Every variable has a set of values that it may store, functions have a set of possible result values, and so on. Every expression has a `ValueSet` too, which represents the best knowledge of the expression’s runtime value when executed.

## `integer`

An [`integer`](integer.md) value-set either spans the entire infinite mathematical set called “the integers” (ℤ) or a subset of ℤ defined as a range.

| Field      | Required | Type        | Meaning                                   |
| ---------- | -------- | ----------- | ----------------------------------------- |
| `universe` | yes      | `"integer"` | Declaration discriminator.                |
| `boxed`    | no       | `true`      | Present if the value is boxed.            |
| `min`      | no       | `string`    | The lower bound of the range (inclusive). |
| `max`      | no       | `string`    | The upper bound of the range (inclusive). |
| `value`    | no       | `string`    | The single value of the set.              |

> [!info] Table: the properties of the `integer` node

[Click here](integer.md) for more details

## `real`

An [`real`](real.md) value-set is either the entire infinite mathematical set “the reals” (ℝ) or a subset of ℝ defined as a range.

| Field      | Required | Type     | Meaning                                   |
| ---------- | -------- | -------- | ----------------------------------------- |
| `universe` | yes      | `"real"` | Declaration discriminator.                |
| `boxed`    | no       | `true`   | Present if the value is boxed.            |
| `min`      | no       | `string` | The lower bound of the range (inclusive). |
| `max`      | no       | `string` | The upper bound of the range (inclusive). |
| `value`    | no       | `string` | The single value of the set.              |

> [!info] Table: the properties of the `real` node

[Click here](real.md) for more details

## `truthvalue`

The three values of three-valued (Kleene K3) truth.

| Field      | Required | Type           | Meaning                        |
| ---------- | -------- | -------------- | ------------------------------ |
| `universe` | yes      | `"truthvalue"` | Declaration discriminator.     |
| `boxed`    | no       | `true`         | Present if the value is boxed. |
| `values`   | no       | `Truthvalue[]` | The values in the set.         |
| `value`    | no       | `Truthvalue`   | The single value in the set.   |

> [!info] Table: the properties of the `truthvalue` node

[Click here](truthvalue.md) for more details

## `string`

An unconstrained string value.

| Field      | Required | Type       | Meaning                      |
| ---------- | -------- | ---------- | ---------------------------- |
| `universe` | yes      | `"string"` | Declaration discriminator.   |
| `value`    | no       | `string`   | The single value in the set. |

> [!info] Table: the properties of the `string` node

[Click here](string.md) for more details

## `rc-type`

A set allowing all instances of a reference counted type (including inheritance). The `name` `MUST` identify a type that is available in the current scope.

| Field       | Required | Type        | Meaning                    |
| ----------- | -------- | ----------- | -------------------------- |
| `universe`  | yes      | `"rc-type"` | Declaration discriminator. |
| `namespace` | no       | `string`    | Optional namespace.        |
| `name`      | yes      | `string`    | The name of the type.      |

> [!info] Table: the properties of the `rc-type` node

[Click here](rc-type.md) for more details

## `interface`

A set allowing all values/entities that conform to an interface (`trait` or `role`). The `name` `MUST` identify a type that is available in the current scope.

| Field       | Required | Type          | Meaning                    |
| ----------- | -------- | ------------- | -------------------------- |
| `universe`  | yes      | `"interface"` | Declaration discriminator. |
| `namespace` | no       | `string`      | Optional namespace.        |
| `name`      | yes      | `string`      | The name of the interface. |

> [!info] Table: the properties of the `interface` node

[Click here](interface.md) for more details

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
