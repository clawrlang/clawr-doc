<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `RELEASE`

[CIR](../README.md) : [Statements](./README.md)

The `RELEASE` statement decrements the reference count of a memory allocation when a variable stops referencing it. If the reference count reaches 0, the allocation is no longer needed and the memory can be freed for use in new allocations.

See also: [`ALLOCATION`](../expresssions/ALLOCATION.md), [`RETAIN`](../expressions/RETAIN.md), [`ENSURE_UNIQUE`](ENSURE_UNIQUE.md)

```ts
type Release = {
  kind: 'RELEASE'
  object: Storage
}

type Storage = Omit<VariableReference, 'value'> | Omit<FieldReference, 'value'>
```

- The reference count of the `object` must be decremented by exactly 1.
- If the reference count reaches 0, the `object` `MUST` be deallocated.
- The backend/runtime `MUST` allow `RELEASE(null)` without crashing.
- The backend `MAY` assign `null` to the variable/field to avoid zombie references.

If the runtime is implemented using stack-allocated values for `ISOLATED` variables, this instruction may be disregarded. (Would that require including the semantics as a property?)
