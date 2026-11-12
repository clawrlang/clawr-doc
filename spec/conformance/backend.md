&nbsp; / &nbsp; [Conformance](./README.md)

# Backend Conformance

A conforming backend accepts a valid [CIR](../cir/README.md) module and produces executable code that honours its semantics. The backend `MAY` choose any lowering strategy and optimization that preserves the observable semantics.

## Input

- Accept any module that validates against the [CIR schema](../cir/schema/cir.schema.json).
- Do not re-do the frontend’s analysis. The CIR is trusted to follow the “Rules for Frontend”.

## Output

- Obey the “Rules for Backend” of every node: [declarations](../cir/declarations/README.md), [statements](../cir/statements/README.md) and [expressions](../cir/expressions/README.md).
- Choose storage for each [value-set lattice](../cir/lattices/README.md) that can hold every value in it.
- Lower reference counting faithfully, or prove it unnecessary: [Automatic Reference Counting](../cir/arc.md).
