# `SELF_INIT

[CIR](../README.md) : [Expressions](./README.md)

Initialize the properties of the `self` entity.

<!-- shape: SelfInitialization -->

| Field        | Required | Type                    | Meaning                                           |
| ------------ | -------- | ----------------------- | ------------------------------------------------- |
| `kind`       | yes      | `"SELF_INIT"`           | Declaration discriminator.                        |
| `type`       | yes      | `RCTypeSet`             | The type of the `self` variable.                  |
| `properties` | yes      | `PropertyInitializer[]` | Property values for initialization discriminator. |

> [!info] Table: the properties of the `SELF_INIT` node

<!-- /shape: SelfInitialization -->

The `value.type` property identifies the type of `self`. In the case of inheritance, the indicated type is one type in the inheritance hierarchy and the owning type of the properties being initialized.

## Rules for Frontend

-

## Rules for Backend

-
