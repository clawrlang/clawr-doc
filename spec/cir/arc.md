&nbsp; / &nbsp; [CIR Reference](./README.md)

# Automatic Reference Counting

This chapter is the normative definition of Clawr’s memory-management contract between frontend and backend. The individual CIR nodes ([`ALLOCATION`](./expressions/ALLOCATION.md), [`RETAIN`](./expressions/RETAIN.md), [`RELEASE`](./statements/RELEASE.md), [`ENSURE_UNIQUE`](./statements/ENSURE_UNIQUE.md), [`BOX`](./expressions/BOX.md)) define only their node-specific rules and refer here for the shared ones.

The rationale is documented in [ADR-015](../../adr/adr-015.md) and [ADR-016](../../adr/adr-016.md).

The frontend has all the static-analysis information, so it injects the ARC operations. The backend lowers them faithfully and stays simple.

## Scope

- `data`, `object`, `service` and explicitly boxed primitives are ARC-managed. The frontend `MUST` inject ARC operations for them.
- Substructures are presumed to be heap-allocated, with reference pointers in their parent structures.
- Unboxed primitives are **not** ARC-managed in the CIR. The frontend `MUST NOT` inject `ALLOCATION`, `RETAIN`, `RELEASE` or `ENSURE_UNIQUE` for them.

## Operations

| Operation       | Effect                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| `ALLOCATION`    | Sets aside memory for a structure (excluding substructures) with a reference count of exactly 1.          |
| `RETAIN`        | Increments the reference count by exactly 1.                                                              |
| `RELEASE`       | Decrements the reference count by exactly 1, and deallocates the structure if the count reaches 0.        |
| `ENSURE_UNIQUE` | If the reference count is greater than 1, shallow-copies the structure and reassigns the variable/property. |

## Assignment

When an assignment replaces a CIR-managed reference, the frontend `MUST` emit a `RETAIN` for the incoming value and a `RELEASE` for the reference being replaced. The frontend `MUST` arrange evaluation and ownership so the incoming value remains valid when the old reference is released, including when both references point to the same entity.

The retained reference belongs to the destination after assignment. If the incoming value also carries a separately owned reference, the frontend `MUST` account for that reference as well; in particular, it `MUST` avoid leaking the +1 reference returned by a call.

For example, to replace `x` with the value of `y`, the frontend can retain `y` into a temporary, release the old `x`, and assign the retained reference to `x`. The temporary's ownership transfers to `x`. Retaining first also keeps the value alive if `x` and `y` alias.

The backend lowers the emitted ARC operations. `ASSIGN` does not implicitly retain the incoming CIR-managed value or release the replaced one. Equivalent optimizations remain permitted as described under [Backend Optimization](#backend-optimization).

## Ownership and Return Values

- A returned ARC-managed value carries a +1 reference for the caller.
- The caller owns that reference and `MUST` release it when it is no longer needed. The caller `MUST NOT` retain a value on receipt.
- The callee `MUST` ensure that the +1 reference survives scope exit, typically by retaining the value before releasing local references.

## Parameters

- Parameters are borrowed by default. The caller does not retain them, and neither does the callee unless the parameter escapes the call context. The caller’s stack frame guarantees the parameter’s lifetime for the duration of the call.
- `UNKNOWN` parameters are read-only ([ADR-004](../../adr/adr-004.md)). If an `UNKNOWN` parameter is stored, it `MUST` be copied to preserve isolation.

## Copy-on-Write

- `ISOLATED` values are eligible for copy-on-write. Before an `ISOLATED` value is modified, the frontend `MUST` ensure that it is uniquely referenced by injecting `ENSURE_UNIQUE`.
- The frontend `MUST NOT` inject `ENSURE_UNIQUE` for a `SHARED` variable, because changes to it are supposed to affect all references.

## Boxing

- Explicitly boxed primitives (the `BOX` expression, and value-sets with `boxed` set) are ordinary ARC-managed values.
- The backend chooses the concrete representation of unboxed primitives. In particular, an `integer` or `real` value or operation may require an arbitrary-precision, pointer-based representation even though it is unboxed in the CIR.
- Any such implicit boxing is backend-private. It `MUST` preserve value semantics: no pointer identity or aliasing may become observable through the language semantics. The backend owns the lifetime of these boxes and `MAY` use reference counting, arenas, immediate values or any other strategy.

## Backend Optimization

The backend `MAY` omit or elide ARC operations — `RETAIN`, `RELEASE` and `ENSURE_UNIQUE` — for values it stores on the stack, or where it can prove them unnecessary, as long as the observable semantics are preserved. A backend that stores `ISOLATED` values on the stack `MUST` copy them immediately on assignment.
