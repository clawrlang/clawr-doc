<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `rc-type`

[CIR](../README.md) : [ValueSets](./README.md)

A set allowing all instances of a reference counted type (meaning `data`, `object` and `service` types). The `name` `MUST` identify a type that is accessible from the current scope.

TypeScript declaration:

```ts
type RCTypeValueSet = {
  type: 'rc-type'
  namespace?: string
  name: string
}
```

JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "type": { "const": "rc-type" },
    "namespace": { "type": "string" },
    "name": { "type": "string" }
  },
  "required": ["type", "name"],
  "additionalProperties": false
}
```
