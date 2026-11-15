&nbsp; / &nbsp; [CIR Reference](../README.md) &nbsp; / &nbsp; [Declarations](./README.md)

# `EXTENSION_DECL`

An `EXTENSION_DECL` contributes methods and optional trait/role conformances to a nominal type without modifying its `RC_TYPE_DECL`. Extension methods are statically dispatched and do not add vtable slots.

<!-- shape: ExtensionDeclaration -->

| Field          | Required | Type                    | Meaning                                           |
| -------------- | -------- | ----------------------- | ------------------------------------------------- |
| `kind`         | yes      | `"EXTENSION_DECL"`      | Declaration discriminator.                        |
| `target`       | yes      | `CanonicalName`         | The type extended by this declaration.            |
| `methods`      | yes      | `FunctionDeclaration[]` | Methods implemented by this extension.            |
| `conformances` | no       | `Conformance[]`         | Conformances and their method fulfillment tables. |

> [!info] Table: the properties of the `EXTENSION_DECL` node

<!-- /shape: ExtensionDeclaration -->

Each conformance records the interface and the method implementations used to construct its witness table. Conformance registration is associated with the target type at runtime; lookup also considers conformances registered on its supertypes.

The target must identify an `RC_TYPE_DECL` in the current CIR artifact. Separate package artifacts and cross-package conflict resolution are deferred.
