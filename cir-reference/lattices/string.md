<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `string`

[CIR](../README.md) : [Lattices](./README.md)

An unconstrained string value. A “string” is a sequence of characters and the `string` value-set is the set of all possible sequences.

There is no way to construct a subset at this time, though future ideas include singleton sets (knowing the value precisely), and strings matching a regular expression.

The schema accepts either an unconstrained string set or a singleton value:

```json
{ "$ref": "../cir.schema.json#/$defs/StringSet" }
```
