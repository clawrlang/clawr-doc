<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `INTERFACE_DECL`

[CIR](../README.md) : [Declarations](./README.md)

The `INTERFACE_DECL` node defines a polymorphic type. The type lists method `requirements` for interactions without implying any specific implementation.

Clawr separates these types into two variants: `trait` and `role`, with varying invocation rules. This distinction is, however, not reflected in the CIR.

## Shape

<!-- shape: InterfaceDeclaration -->

| Field       | Required | Type                  | Meaning                                      |
| ----------- | -------- | --------------------- | -------------------------------------------- |
| `kind`      | yes      | `"INTERFACE_DECL"`    | Declaration discriminator.                   |
| `name`      | yes      | `string`              | Type name.                                   |
| `namespace` | no       | `string`              | Optional namespace.                          |
| `methods`   | yes      | `FunctionSignature[]` | Methods that must exist on conforming types. |

> [!info] Table: the properties of the `INTERFACE_DECL` node

<!-- /shape: InterfaceDeclaration -->

<!-- shape: FunctionSignature -->

| Field        | Required | Type                              | Meaning                                   |
| ------------ | -------- | --------------------------------- | ----------------------------------------- |
| `baseName`   | yes      | `string`                          | Function base name.                       |
| `labels`     | yes      | `string[]`                        | Labels; part of the unique function name. |
| `parameters` | yes      | `Parameter[]`                     | Each parameter has `name` and `type`.     |
| `returnType` | yes      | <code>ValueSet &#124; Void</code> | `{"universe":"void"}` means no result.    |

> [!info] Table: the properties of the `FunctionSignature` node

<!-- /shape: FunctionSignature -->

<!-- shape: Parameter -->

| Field  | Required | Type       | Meaning                    |
| ------ | -------- | ---------- | -------------------------- |
| `name` | yes      | `string`   | The name of the parameter. |
| `type` | yes      | `ValueSet` | The type of the parameter. |

> [!info] Table: the properties of the `Parameter` node

<!-- /shape: Parameter -->

The `name` and `namespace` properties uniquely identify the type.

The `methods` property lists a set of method signatures (name and return-type) that define interactions with conforming entities.

## Polymorphic Interface

An interface is an interaction surface. An object’s interface depends on your vantage point. An object has full access to its own state, but other objects — of different types — see only its public methods.

An `INTERFACE_DECL` is a contract that promises that the object’s interface will include certain named interaction points (`methods`). It does not say anything about the implementation or behavior of the methods, only that they must exist. Polymorphism allows multiple different behaviors to be accessed by the same calling code. Many important patterns are based on this:

- **Strategy**: choose between different implementations, e.g. an email sender or an SMS sender for notifications.
- **Composite**: call the same operation on a single object or a larger structure, e.g. a file system where `size()` works on a file or a directory alike.

## Rules for Frontend

- The `name` and optional `namespace` `MUST` combine to a unique identifier. No other type, variable or function in the package may have the same identifier.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

## Rules for Backend

## Examples

```json
{
  "kind": "INTERFACE_DECL",
  "name": "MyTrait",
  "namespace": "my_namespace",
  "methods": [
    {
      "baseName": "f",
      "labels": [],
      "parameters": [],
      "returnType": {
        "universe": "integer",
        "min": "0",
        "max": "100"
      }
    }
  ]
}
```
