&nbsp; / &nbsp; [The Clawr Language](../README.md)

# Built-in Types

Clawr's built-in types are value sets in distinct universes. A subset can constrain the values in a universe; see [Types as Sets](../sets.md).

- [`integer`](./integer.md): whole numbers, including negative values.
- [`real`](./real.md): real numbers with explicitly specified precision for
  stored values and arithmetic.
- [`truthvalue`](./truthvalue.md): `false`, `ambiguous`, and `true`; `boolean`
  is the subset containing only `false` and `true`.
- [`string`](./string.md): sequences of characters.
- [`Fields`](./fields.md): finite ordered sequences of binary or ternary
  truth-value lanes.

The shared operator precedence and grouping rules are in [Operators](./operators.md). User-defined types are described in [User-Defined Types](../user-types/README.md).

## Proposed Types

The following types are not currently part of the language:

- `character`
- `regex`
- `error`
- lambda and tuple types
- fixed-size arrays
