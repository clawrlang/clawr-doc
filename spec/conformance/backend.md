&nbsp; / &nbsp; [Conformance](./README.md)

# Backend Conformance

A conforming backend accepts a semantically valid [CIR](../cir/README.md) artifact and produces executable code that honours its semantics. The backend `MAY` choose any lowering strategy and optimization that preserves the observable semantics.

## Input

- Accept CIR that satisfies the [schema](../cir/schema/cir.schema.json) and the applicable semantic rules.
- The frontend is responsible for ownership analysis and the “Rules for Frontend”. A backend may trust these guarantees; it may also validate its input and reject invalid CIR. Schema validation alone does not establish semantic validity or safety.

## Output

- Obey the “Rules for Backend” of every node: [declarations](../cir/declarations/README.md), [statements](../cir/statements/README.md) and [expressions](../cir/expressions/README.md).
- Choose storage for each [value-set lattice](../cir/lattices/README.md) that can hold every value in it.
- Lower reference counting faithfully, or prove it unnecessary: [Automatic Reference Counting](../cir/arc.md).
