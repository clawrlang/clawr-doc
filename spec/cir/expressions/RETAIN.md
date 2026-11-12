&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Expressions](./README.md)

# `RETAIN`

The general ARC rules are defined in [Automatic Reference Counting](../arc.md).

Increment the reference count of an allocation. The reference count of the `object` `MUST` be increased by exactly one.

<!-- shape: Retain -->

| Field    | Required | Type                                                            | Meaning                             |
| -------- | -------- | --------------------------------------------------------------- | ----------------------------------- |
| `kind`   | yes      | `"RETAIN"`                                                      | Declaration discriminator.          |
| `object` | yes      | `Storage`                                                       | The variable or property to retain. |
| `type`   | yes      | <code>RCTypeSet &#124; InterfaceSet &#124; BoxedValueSet</code> | The type of the retained entity.    |

> [!info] Table: the properties of the `RETAIN` node

<!-- /shape: Retain -->

`BoxedValueSet` is a primitive value-set with `boxed: true`. Its constraints are defined in the [expression schema](../schema/expressions.json).

## Rules for Frontend

- The `object` `MUST` refer to a CIR-managed value: a reference-counted entity, an interface value, or an explicitly boxed primitive. Unboxed primitives are not CIR-managed.

## Rules for Backend

- The reference count of the `object` `MUST` be increased by exactly one.
- If the runtime is implemented using stack-allocated values for `ISOLATED` variables, this instruction `MAY` be disregarded. See [Backend Optimization](../arc.md#backend-optimization). (Might require including the `isolationLevel` as a property.)
