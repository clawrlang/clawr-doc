<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `real`

[CIR](../README.md) : [ValueSets](./README.md)

A range of real values. A constant integer (e.g. a `const` variable or a literal) will have `min` = `max`, equal to the constant itself. Other value-sets may skip either the `min`, `max` or both properties.

If either or both limits is excluded, the value could be any real number (ℝ), and the backend `MUST` use arbitrary precision to store the value. If both limits are set, the backend `MAY` use an optimised storage type for the value.

TypeScript declaration:

```ts
type RealValueSet = {
  type: 'real'
  min?: string // numeric, can be arbitrarity big
  max?: string // numeric, can be arbitrarity big
}
```

JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "type": { "const": "real" },
    "min": { "type": "string" },
    "max": { "type": "string" }
  },
  "required": ["type"],
  "additionalProperties": false
}
```

## Rules for Frontend

## Rules for Backend

<script>
MathJax = { tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] } };
</script>
<script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
</script>
