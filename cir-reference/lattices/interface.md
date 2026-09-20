<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `interface`

[CIR](../README.md) : [Lattices](cir-reference/lattices/README.md)

A set allowing all values/entities that conform to an interface (`trait` or `role`). The `name` `MUST` identify an [INTERFACE_DECL](../declarations/INTERFACE_DECL.md) declaration that is accessible from the current scope.

```ts
type InterfaceLattice = {
  type: 'interface'
  namespace?: string
  name: string
}
```
