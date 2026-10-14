<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `rc-type`

[CIR](../README.md) : [Lattices](cir-reference/lattices/README.md)

A set allowing all instances of a reference counted type (meaning `data`, `object` and `service` types). The `name` `MUST` identify an [RC_TYPE_DECL](../declarations/RC_TYPE_DECL.md) declaration that is accessible from the current scope.

| Field       | Required | Type        | Meaning                    |
| ----------- | -------- | ----------- | -------------------------- |
| `universe`  | yes      | `"rc-type"` | Declaration discriminator. |
| `namespace` | no       | `string`    | Optional namespace.        |
| `name`      | yes      | `string`    | The name of the type.      |

> [!info] Table: the properties of the `rc-type` node
