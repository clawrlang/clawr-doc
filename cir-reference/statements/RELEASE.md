&nbsp; / &nbsp;[CIR Reference](../README.md) &nbsp; / &nbsp; [Statements](./README.md)

# `RELEASE`

The `RELEASE` statement decrements the reference count of a memory allocation when a variable stops referencing it. If the reference count reaches 0, the allocation is no longer needed and the memory can be freed for use in new allocations.

See also: [`ALLOCATION`](../expresssions/ALLOCATION.md), [`RETAIN`](../expressions/RETAIN.md), [`ENSURE_UNIQUE`](ENSURE_UNIQUE.md)

<!-- shape: Release -->

| Field    | Required | Type        | Meaning                                 |
| -------- | -------- | ----------- | --------------------------------------- |
| `kind`   | yes      | `"RELEASE"` | Declaration discriminator.              |
| `object` | yes      | `Storage`   | The variable or field that exits scope. |

> [!info] Table: the properties of the `RELEASE` node

<!-- /shape: Release -->

- The reference count of the `object` must be decremented by exactly 1.
- If the reference count reaches 0, the `object` `MUST` be deallocated.
- The backend/runtime `MUST` allow `RELEASE(null)` without crashing.
- The backend `MAY` assign `null` to the variable/property to avoid zombie references.

If the runtime is implemented using stack-allocated values for `ISOLATED` variables, this instruction may be disregarded. (Would that require including the semantics as a property?)
