&nbsp; / &nbsp; [Conformance](./README.md)

# Frontend Conformance

A conforming frontend reads Clawr source code, enforces the language rules, and emits a structurally and semantically valid [CIR](../cir/README.md) artifact.

## Input

- Accept and reject source code according to the [language reference](../language/README.md), including [types](../language/types.md), [sets](../language/sets.md), [isolation and sharing](../language/isolation-v-sharing/README.md), [user-defined types](../language/user-types/README.md) and [semantics](../language/semantics/README.md).
- Resolve declarations from the [standard library sources](../stdlib/sources.md).

## Output

- Emit JSON that validates against the [CIR schema](../cir/schema/cir.schema.json).
- Obey the “Rules for Frontend” of every node you emit: [declarations](../cir/declarations/README.md), [statements](../cir/statements/README.md) and [expressions](../cir/expressions/README.md).
- Describe data with [value-set lattices](../cir/lattices/README.md).
- Inject reference-counting operations as defined in [Automatic Reference Counting](../cir/arc.md).
