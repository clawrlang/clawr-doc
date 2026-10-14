<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `AS_SHARED`

[CIR](../README.md) : [Expressions](./README.md)

Upgrade a uniquely referenced `ISOLATED` value to a `SHARED` entity.

<!-- shape: AsShared -->

| Field    | Required | Type                     | Meaning                           |
| -------- | -------- | ------------------------ | --------------------------------- |
| `kind`   | yes      | `"AS_SHARED"`            | Declaration discriminator.        |
| `object` | yes      | `FunctionCallExpression` | The entity to promote to sharing. |
| `type`   | yes      | `RCTypeSet`              | The type of the entity.           |

> [!info] Table: the properties of the `AS_SHARED` node

<!-- /shape: AsShared -->

## Rules for Frontend

- The reference count of the `object` value `MUST` be exactly 1.

## Rules for Backend

- The backend `MAY` create a copy of the value or just modify an isolation flag on the value.
- The backend `MAY` collapse the structure and pass a flag into the function implementation instead. But in that case, it `MUST` pass the equivalent of `ISOLATED` to that function whenever the `AS_SHARED` structure does not wrap the call.
- The backend `MAY` ignore the wrapper entirely if it does not track isolation-levels for allocations. But it `MUST` still perform the wrapped function `CALL`.

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
