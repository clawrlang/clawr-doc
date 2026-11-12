&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Statements](./README.md)

# `SELF_INIT`

Initialize the properties of the `self` entity.

<!-- shape: SelfInitialization -->

| Field        | Required | Type                    | Meaning                                           |
| ------------ | -------- | ----------------------- | ------------------------------------------------- |
| `kind`       | yes      | `"SELF_INIT"`           | Declaration discriminator.                        |
| `type`       | yes      | `RCTypeSet`             | The type of the `self` variable.                  |
| `properties` | yes      | `PropertyInitializer[]` | Property values for initialization discriminator. |

> [!info] Table: the properties of the `SELF_INIT` node

<!-- /shape: SelfInitialization -->

The `type` property identifies the type whose properties are initialized. With inheritance, it identifies the owning type at one level of the `self` entity's hierarchy. Each item in `properties` names a property and supplies its initial value as an expression.

## Rules for Frontend

- `SELF_INIT` `MUST` occur in an initializer with a `self` entity whose hierarchy includes the indicated type.
- The property names `MUST` identify all properties declared at that level, without duplicates, and each `MUST` have a compatible value. See [Initialization and Inheritance](../../language/user-types/object-data.md#initialization-and-inheritance).
- Initialization of the hierarchy `MUST` follow the ordering defined in that section.

## Rules for Backend

- Evaluate the supplied property expressions and initialize the corresponding properties of the existing `self` entity. `SELF_INIT` does not allocate another entity.
- Preserve the initialization ordering and the ownership effects of the supplied expressions.
