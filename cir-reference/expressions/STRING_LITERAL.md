<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `STRING_LITERAL`

[CIR](../README.md) : [Expressions](./README.md)

A `STRING_LITERAL` is a simple textual value. The backend `MAY` lower this as a simple string if it can avoid dereferencing it as a zombie. It also `MAY` add reference counting or other mechanisms to ensure that the value is deallocated when no longer used.

```ts
type StringLiteral = {
  kind: 'STRING_LITERAL'
  value: StringLattice & { value: string }
}
```

The `value` property is a singleton set that specifies the literal text.

## JSON Shema

```json
{
  "type": "object",
  "properties": {
    "kind": { "const": "STRING_LITERAL" },
    "value": { "type": "string" }
  },
  "required": ["kind", "value"],
  "additionalProperties": false
}
```
