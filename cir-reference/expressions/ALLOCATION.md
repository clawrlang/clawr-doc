<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `ALLOCATION`

[CIR](../README.md) : [Expressions](./README.md)

Allocate memory for a reference-counted entity.

```ts
type MemoryAllocation = {
  kind: 'ALLOCATION'
  isolationLevel: IsolationLevel
  properties?: {
    name: string
    value: Expression
  }[]
  domain: RCTypeSet
}

type IsolationLevel = 'ISOLATED' | 'SHARED'
```

The `type` property includes a `name` and `namespace` that identifies the type of the new entity.

The `base` property — if specified — indicates that the type is a subtype of a different type which might affect how to perform memory allocation.

The `isolationLevel` property in included as a courtesy. The backend `MAY` use the information to aid optimisation.

The `properties` property indicates the initial value of the allocated memory.

## Rules for Frontend

- The `type` property `MUST` identify a reference-counted type.
- The `isolationLevel` property `MUST` match the isolation-level of the variable, property or parameter the value is used for.
- The property `name`s and `value`s `MUST` match the names and value-sets of the properties defined in the corresponding [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md).
- All properties defined in the corresponding [`RC_TYPE_DECL`](../declarations/RC_TYPE_DECL.md) must be named in the `properties` list.

## Rules for Backend

- The backend `MUST` allocate enough memory to store the entire entity, plus whatever additional information it needs for reference counting and other runtime checks.
- The backend `MAY` use the `isolationLevel` property to aid optimization. If the value is `"ISOLATED"` the backend `MAY` use stack allocation instead of heap allocation. But then it `MUST` dereference `ISOLATED` values accordingly in other expressions.
- The `properties` property indicates the initial value of the allocated memory. The backend `MUST` populate each property with the value of the corresponding `Expression`.
