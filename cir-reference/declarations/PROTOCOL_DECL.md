<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `PROTOCOL_DECL`

[CIR](../README.md) : [Declarations](./README.md)

The `PROTOCOL_DECL` node defines a contract type (`trait`/`role`). The type lists method `requirements` for interactions without mandating the implementation of said interactions.

Clawr separates these types in two variants: `trait` and `role`, with varying invocation rules. This distinction is however not reflected in the CIR.

```ts
type ProtocolDeclaration = {
  kind: 'PROTOCOL_DECL'
  name: string
  requirements: FunctionSignature[]
  companionRequirements?: FunctionSignature[]
}
```

## Rules for Frontend

## Rules for Backend

## Examples

Simple `data` structure:

```json
{
  "kind": "PROTOCOL_DECL",
  "name": "MyTrait",
  "namespace": "my_namespace",
  "requirements": [
    {
      "baseName": "f",
      "labels": [],
      "parameters": [],
      "lattice": {
        "type": "integer",
        "min": "0",
        "max": "100"
      }
    }
  ]
}
```
