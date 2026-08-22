<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `rc-type`

[CIR](../README.md) : [Lattices](cir-reference/lattices/README.md)

A set allowing all instances of a reference counted type (meaning `data`, `object` and `service` types). The `name` `MUST` identify an [RC_TYPE_DECL](../declarations/RC_TYPE_DECL.md) declaration that is accessible from the current scope.

```ts
type RCTypeLattice = {
  type: 'rc-type'
  namespace?: string
  name: string
}
```
