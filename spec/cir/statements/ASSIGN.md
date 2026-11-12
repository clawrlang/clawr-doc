&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Statements](./README.md)

# `ASSIGN`

Assign a value to a variable or a property.

<!-- shape: Assign -->

| Field    | Required | Type         | Meaning                        |
| -------- | -------- | ------------ | ------------------------------ |
| `kind`   | yes      | `"ASSIGN"`   | Declaration discriminator.     |
| `target` | yes      | `Storage`    | Target to mutate.              |
| `value`  | yes      | `Expression` | Value to assign to the target. |

> [!info] Table: the properties of the `ASSIGN` node

<!-- /shape: Assign -->

## Rules for Frontend

- The `target` `MUST` identify a variable or property that can be assigned at this point. Its declared value-set and the `value` expression `MUST` satisfy the language's [assignment rules](../../language/sets.md).
- For an isolated reference-counted structure, mutations `MUST` preserve copy-on-write semantics as described in [Automatic Reference Counting](../arc.md#copy-on-write).
- For CIR-managed references, the frontend `MUST` emit the `RETAIN` and `RELEASE` operations required by the [assignment ownership contract](../arc.md#assignment).

## Rules for Backend

- Evaluate `value` and store the result in the storage identified by `target`, preserving the observable semantics of the value and target.
- Preserve the required value semantics for isolated values, including the [copy-on-write rules](../arc.md#copy-on-write).
- Do not add an implicit retain or release for CIR-managed references. The frontend supplies those operations. Managing a backend-private representation of an unboxed primitive is separate; see [Boxing](../arc.md#boxing).
