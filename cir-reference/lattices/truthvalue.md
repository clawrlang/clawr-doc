<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `truthvalue`

[CIR](../README.md) : [Lattices](./README.md)

A set of truth-values.

Rather than a simple Boolean type, Clawr considers a three-valued truth:

TypeScript declaration:

```ts
type TruthvalueLattice<T extends truthvalue[]> = {
  type: 'truthvalue'
  values: T
}

type truthvalue = 'false' | 'ambiguous' | 'true'
```

JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "type": { "const": "truthvalue" },
    "values": {
      "type": "array",
      "items": {
        "oneOf": [
          { "const": "ambiguous" },
          { "const": "false" },
          { "const": "true" }
        ]
      }
    }
  },
  "required": ["type", "values"],
  "additionalProperties": false
}
```

There is still a `boolean` “type.” but it is not a type in the same way as ordinary

Clawr employs sets and lattices to determine value compatibility.

```clawr
subset boolean = truthvalue(false|true)
```
