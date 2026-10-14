<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `ASSIGN`

[CIR](../README.md) : [Expressions](./README.md)

Assign a value to a variable or a property.

<!-- shape: Assign -->

| Field    | Required | Type         | Meaning                        |
| -------- | -------- | ------------ | ------------------------------ |
| `kind`   | yes      | `"ASSIGN"`   | Declaration discriminator.     |
| `target` | yes      | `Storage`    | Target to mutate.              |
| `value`  | yes      | `Expression` | Value to assign to the target. |

> [!info] Table: the properties of the `ASSIGN` node

<!-- /shape: Assign -->

## Rules for Frontend

-

## Rules for Backend

-

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
