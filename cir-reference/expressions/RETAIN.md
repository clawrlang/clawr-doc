<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `RETAIN`

[CIR](../README.md) : [Expressions](./README.md)

Increment the reference count of an allocation. The reference count of the `object` `MUST` be increased by exactly one.

```ts
type MemoryRetention = {
  kind: 'RETAIN'
  object: Storage
  value: RCTypeLattice
}

type Storage = Omit<VariableReference, 'value'> | Omit<FieldReference, 'value'>
```

## Rules for Frontend

- The `object` `MUST` have a reference-counted type ( [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md))

## Rules for Backend

- The reference count of the `object` `MUST` be increased by exactly one.
- If the runtime is implemented using stack-allocated values for `ISOLATED` variables, this instruction may be disregarded. (Might require including the `isolationLevel` as a property.)
