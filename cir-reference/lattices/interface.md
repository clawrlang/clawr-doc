&nbsp; / &nbsp;[CIR Reference](../README.md) &nbsp; / &nbsp; [Lattices](./README.md)

# `interface`

A set allowing all values/entities that conform to an interface (`trait` or `role`). The `name` `MUST` identify an [INTERFACE_DECL](../declarations/INTERFACE_DECL.md) declaration that is accessible from the current scope.

<!-- shape: InterfaceSet -->

| Field       | Required | Type          | Meaning                    |
| ----------- | -------- | ------------- | -------------------------- |
| `universe`  | yes      | `"interface"` | Declaration discriminator. |
| `namespace` | no       | `string`      | Optional namespace.        |
| `name`      | yes      | `string`      | The name of the interface. |

> [!info] Table: the properties of the `interface` node

<!-- /shape: InterfaceSet -->
