<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Declarations

[CIR](../README.md)

Declarations are added to the top scope of a module in the `ClawrModule.declarations` array. Declarations may define types, functions or global variables. The order in which they appear is of some importance (see the rules below). As a rule of thumb, entities must be declared prior to any declarations that reference them.

The module root is defined by [`cir.schema.json`](../cir.schema.json); its `declarations` items use the following schema:

```json
{ "$ref": "../cir.schema.json#/$defs/Declaration" }
```

This document lists all declarations and their content.

## `RC_TYPE_DECL`

The `RC_TYPE_DECL` defines a type that stores its internal data in properties. The type might include `methods` for interactions. Clawr separates these types in three variants: `data`, `object` and `service`, with varying structural rules. That distinction is irrelevant to the runtime and lowering, so it is not reflected in the CIR.

<!-- shape: RCTypeDeclaration -->

| Field           | Required | Type                        | Meaning                                                     |
| --------------- | -------- | --------------------------- | ----------------------------------------------------------- |
| `kind`          | yes      | `"RC_TYPE_DECL"`            | Declaration discriminator.                                  |
| `name`          | yes      | `string`                    | The name of the declared type.                              |
| `namespace`     | no       | `string`                    | Optional namespace.                                         |
| `properties`    | yes      | `PropertyDeclaration[]`     | The stored properties of the declared type.                 |
| `conformances`  | no       | `Conformance[]`             | Interfaces the declared type conforms to.                   |
| `base`          | no       | `CanonicalName`             | The supertype of the declared type.                         |
| `methods`       | no       | `FunctionDeclaration[]`     | The methods of the declared type.                           |
| `initializers`  | no       | `FunctionDeclarationVoid[]` | Initializer methods of the declared type.                   |
| `dispatchTable` | no       | `DispatchTableEntry[]`      | Table for looking up interface conformance implementations. |

> [!info] Table: the properties of the `RC_TYPE_DECL` node

<!-- /shape: RCTypeDeclaration -->

[Click here](RC_TYPE_DECL.md) for more details

## `INTERFACE_DECL`

The `INTERFACE_DECL` node defines a polymorphic type (`trait`/`role`). The type lists method `requirements` for interactions without mandating the implementation of said methods. Clawr separates these types in two variants: `trait` and `role`, with varying invocation rules. This distinction is however not reflected in the CIR.

<!-- shape: InterfaceDeclaration -->

| Field       | Required | Type                  | Meaning                                      |
| ----------- | -------- | --------------------- | -------------------------------------------- |
| `kind`      | yes      | `"INTERFACE_DECL"`    | Declaration discriminator.                   |
| `name`      | yes      | `string`              | Type name.                                   |
| `namespace` | no       | `string`              | Optional namespace.                          |
| `methods`   | yes      | `FunctionSignature[]` | Methods that must exist on conforming types. |

> [!info] Table: the properties of the `INTERFACE_DECL` node

<!-- /shape: InterfaceDeclaration -->

[Click here](INTERFACE_DECL.md) for more details

## `VARIABLE_DECL`

A variable in the module scope. The variable will be accessible to all functions and methods defined in the module.

<!-- shape: VariableDeclaration -->

| Field          | Required | Type              | Meaning                            |
| -------------- | -------- | ----------------- | ---------------------------------- |
| `kind`         | yes      | `"VARIABLE_DECL"` | Declaration discriminator.         |
| `name`         | yes      | `string`          | The name of the declared variable. |
| `namespace`    | no       | `string`          | Optional namespace.                |
| `type`         | yes      | `ValueSet`        | The type of the variable.          |
| `initialValue` | yes      | `Expression`      | The initial value of the variable. |

> [!info] Table: the properties of the `VARIABLE_DECL` node

<!-- /shape: VariableDeclaration -->

[Click here](VARIABLE_DECL.md) for more details

## `FUNCTION_DECL`

A `FUNCTION_DECL` defines a “free function” in the module, a “static” `companion` method, or a method on an `object`/`service` type.

<!-- shape: FunctionDeclaration -->

| Field        | Required | Type                              | Meaning                                   |
| ------------ | -------- | --------------------------------- | ----------------------------------------- |
| `kind`       | yes      | `"FUNCTION_DECL"`                 | Declaration discriminator.                |
| `baseName`   | yes      | `string`                          | Function base name.                       |
| `labels`     | yes      | `string[]`                        | Labels; part of the unique function name. |
| `parameters` | yes      | `Parameter[]`                     | Each parameter has `name` and `type`.     |
| `returnType` | yes      | <code>ValueSet &#124; Void</code> | `{"universe":"void"}` means no result.    |
| `body`       | yes      | `Statement[]`                     | Function body.                            |
| `namespace`  | no       | `string`                          | Optional namespace (not for methods).     |

> [!info] Table: the properties of the `FUNCTION_DECL` node

<!-- /shape: FunctionDeclaration -->

[Click here](FUNCTION_DECL.md) for more details

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
