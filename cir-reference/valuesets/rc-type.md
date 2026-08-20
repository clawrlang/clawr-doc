<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `rc-type`

[CIR](../README.md) : [ValueSets](./README.md)

A set allowing all instances of a reference counted type (meaning `data`, `object` and `service` types). The `typeName` `MUST` identify a type that is accessible from the current scope.

TypeScript declaration:

```ts
type RcTypeValueSet = {
  type: 'rc-type'
  namespace?: string
  typeName: string
}
```

JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "type": { "const": "rc-type" },
    "namespace": { "type": "string" },
    "typeName": { "type": "string" }
  },
  "required": ["type", "typeName"],
  "additionalProperties": false
}
```

