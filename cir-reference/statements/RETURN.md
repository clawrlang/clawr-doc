<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `RETURN`

[CIR](../README.md) : [Expressions](./README.md)

Return early from a `void` function or return a value from a query function.

```json
{ "$ref": "../cir.schema.json#/$defs/Return" }
```

The `value` property indicates the returned value.

## Rules for Frontend

- If the current function has `returnType: {"universe":"void"}`, the `value` property `MUST` be omitted.
- If the current function has a non-void `returnType`, the `value` property `MUST NOT` be omitted.
- The `value` `MUST` match the `isolationLevel` and `returnType` of the current function.

## Rules for Backend

-
