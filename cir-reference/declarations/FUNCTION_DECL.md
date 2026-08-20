<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `FUNCTION_DECL`

[CIR](../README.md) : [Declarations](./README.md)

A `FUNCTION_DECL` defines a “free function” in the module, a “static” `companion` method, or a method on an `object`/`service` type. A function's unique name is defined by its `baseName` and its labels (plus the optional `namespace` that exists on all declarations).

```ts
type FunctionDeclaration = {
  kind: 'FUNCTION_DECL'
  body: Statement[]
} & FunctionSignature

type FunctionSignature = {
  baseName: string
  labels: string[]
  parameters: {
    name: string
    valueSet: ValueSet
  }[]
  resultValueSet?: ValueSet
}
```

A function's unique name is defined by its `baseName` and its `labels` (plus the optional `namespace` that exists on all module-scoped declarations).

In the source code, each parameter is defined by an optional label. In the CIR, those `labels` are considered part of the function name.

The `name` is how the parameter is referenced in the function body, and the `valueSet` identifies the type of the variable. It is a `ValueSet` — not a simple type name — to allow the backend to make custom storage optimisation.

The `resultValueSet` — like parameter value-sets — is a hint to allow the backend to lower the function definition with an appropriate storage type. An `undefined`/`null` `resultValueSet` indicates that the function returns no result (`void` in C-like languages).

## Rules for Frontend

- A `FUNCTION_DECL` that reference a type `MUST` appear after the corresponding `RC_TYPE_DECL`.
- The `labels` array `MUST` have at most the same number of items as the `parameters`.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

## Rules for Backend

- The `body` statements `MUST` be executed in the order they appear or in an order that is semantically equivalent.
- For the sake of optimization, the `body` statements `MAY` be executed in a different order than they appear, provided that the semantic meaning is not affected.
- When mangling a function name, the backend `MUST` use a naming scheme that includes all labels, but is unlikely to cause collisions with programmer-defined names. The backend `MAY` use the cedilla (`¸`) character to separate labels from each other, and from the `baseName`. The frontend `MUST` forbid that character in Clawr identifiers.
