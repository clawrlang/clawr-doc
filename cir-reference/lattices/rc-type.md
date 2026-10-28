&nbsp; / &nbsp;[CIR Reference](../README.md) &nbsp; / &nbsp; [Lattices](./README.md)

# `rc-type`

A set allowing all instances of a reference counted type (meaning `data`, `object` and `service` types). The `name` `MUST` identify an [RC_TYPE_DECL](../declarations/RC_TYPE_DECL.md) declaration that is accessible from the current scope.

<!-- shape: RCTypeSet -->

| Field       | Required | Type        | Meaning                    |
| ----------- | -------- | ----------- | -------------------------- |
| `universe`  | yes      | `"rc-type"` | Declaration discriminator. |
| `namespace` | no       | `string`    | Optional namespace.        |
| `name`      | yes      | `string`    | The name of the type.      |

> [!info] Table: the properties of the `rc-type` node

<!-- /shape: RCTypeSet -->
