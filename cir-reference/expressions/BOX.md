<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `BOX`

[CIR](../README.md) : [Expressions](./README.md)

A `BOX` is reference-counted wrapper for a primitive value.

<!-- shape: Box -->

| Field        | Required | Type         | Meaning                                            |
| ------------ | -------- | ------------ | -------------------------------------------------- |
| `kind`       | yes      | `"BOX"`      | Declaration discriminator.                         |
| `expression` | yes      | `Expression` | The primitive value to box.                        |
| `type`       | yes      | `ValueSet`   | The type of the boxed value (with boxed flag set). |

> [!info] Table: the properties of the `BOX` node

<!-- /shape: Box -->

## Rules for Frontend

## Rules for Backend

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
