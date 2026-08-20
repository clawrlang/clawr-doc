<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `string`

[CIR](../README.md) : [ValueSets](./README.md)

An unconstrained string value. A “string” is a sequence of characters and the `string` value-set is the set of all possible sequences.

There is no way to construct a subset at this time, though future ideas include singleton sets (knowing the value precisely), and strings matching a regular expression.

TypeScript declaration:

```ts
type StringValueSet = { type: 'string' }
```

JSON Schema:

```json
{
  "type": "object",
  "properties": { "type": { "const": "string" } },
  "required": ["type"],
  "additionalProperties": false
}
```
