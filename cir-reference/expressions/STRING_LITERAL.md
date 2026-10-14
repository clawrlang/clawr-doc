<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `STRING_LITERAL`

[CIR](../README.md) : [Expressions](./README.md)

A `STRING_LITERAL` is a simple textual value. The backend `MAY` lower this as a simple string if it can avoid dereferencing it as a zombie. It also `MAY` add reference counting or other mechanisms to ensure that the value is deallocated when no longer used.

| Field  | Required | Type               | Meaning                     |
| ------ | -------- | ------------------ | --------------------------- |
| `kind` | yes      | `"STRING_LITERAL"` | Declaration discriminator.  |
| `type` | yes      | `StringSingleton`  | The type of the expression. |

> [!info] Table: the properties of the `STRING_LITERAL` node

The `type` property is a singleton set that specifies the literal text.

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
