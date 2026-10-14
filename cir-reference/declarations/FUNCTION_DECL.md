<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `FUNCTION_DECL`

[CIR](../README.md) : [Declarations](./README.md)

A `FUNCTION_DECL` defines a “free function” in the module or a method on an `object`/`service` type. A function's unique name is defined by its `baseName` and its labels, plus the optional `namespace`.

## Shape

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

<!-- shape: Parameter -->

| Field  | Required | Type       | Meaning                    |
| ------ | -------- | ---------- | -------------------------- |
| `name` | yes      | `string`   | The name of the parameter. |
| `type` | yes      | `ValueSet` | The type of the parameter. |

> [!info] Table: the properties of the `Parameter` node

<!-- /shape: Parameter -->

<!-- shape: Void -->

| Field      | Required | Type     | Meaning                    |
| ---------- | -------- | -------- | -------------------------- |
| `universe` | yes      | `"void"` | Declaration discriminator. |

> [!info] Table: the properties of the `void` node

<!-- /shape: Void -->

A function's unique name is defined by its `baseName` and its `labels` (plus the optional `namespace` that exists on all module-scoped declarations).

In the source code, each parameter is defined by an optional label. In the CIR, those `labels` are considered part of the unique, canonical function name.

The parameter `name` is how it is referenced in the function body, and its `type` identifies the parameter's value-set. It is a value-set — not a simple type name — to allow the backend to make custom storage optimisation.

The function's `returnType` — like parameter value-sets — is a hint to allow the backend to lower the function definition with an appropriate storage type. A `returnType` of `{"universe":"void"}` indicates that the function returns no result (`void` in C-like languages).

## Example

```json
{
  "kind": "FUNCTION_DECL",
  "baseName": "log",
  "labels": ["message"],
  "parameters": [
    {
      "name": "message",
      "type": { "universe": "string" }
    }
  ],
  "returnType": { "universe": "void" },
  "body": []
}
```

> [!info] Relevant JSON Schema excerpt
>
> ```jsonc
> "FunctionDeclaration": {
>   "oneOf": [
>     { "$ref": "#/$defs/FunctionDeclarationVoid" },
>     { "$ref": "#/$defs/FunctionDeclarationNonvoid" }
>   ]
> },
>
> "FunctionDeclCommon": {
>   "allOf": [
>     { "$ref": "#/$defs/FunctionSignatureCommon" },
>     {
>       "type": "object",
>       "properties": {
>         "kind": { "const": "FUNCTION_DECL" },
>         "body": {
>           "type": "array",
>           "items": { "$ref": "#/$defs/Statement" }
>         },
>         "namespace": { "type": "string" }
>       },
>       "required": ["kind", "body"]
>     }
>   ]
> }
> ```

## Rules for Frontend

- A `FUNCTION_DECL` that reference a type `MUST` appear after the corresponding `RC_TYPE_DECL`.
- The `labels` array `MUST` have at most the same number of items as the `parameters`.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

## Rules for Backend

- The `body` statements `MUST` be executed in the order they appear or in an order that is semantically equivalent.
- For the sake of optimization, the `body` statements `MAY` be executed in a different order than they appear, provided that the semantic meaning is not affected.
- When mangling a function name, the backend `MUST` use a naming scheme that includes all labels, but is unlikely to cause collisions with programmer-defined names. The backend `MAY` use the cedilla (`¸`) character to separate labels from each other, and from the `baseName`. The frontend `MUST` forbid that character in Clawr identifiers.

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
