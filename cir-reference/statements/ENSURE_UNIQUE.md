<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `ENSURE_UNIQUE`

[CIR](cir-reference/README.md) : [Statements](cir-reference/statements/README.md)

An `ENSURE_UNIQUE` statement is injected to preserve isolation between copy-on-write variables and fields. When assigning a variable/field to another, the value does not need to be copied immediately. Aliasing is allowed. When one of the references is modified however, it `MUST` be relocated (using `ENSURE_UNIQUE`) before the change is applied.

```ts
type EnsureUnique = {
  kind: 'ENSURE_UNIQUE'
  object: Storage
}

type Storage = VariableReference | FieldReference
```

## Rules for Frontend

- The `object` property `MUST` reference an `ISOLATED` variable or field.
- The operation `MUST` be injected before any assignment to the fields of an `ISOLATED` (`const`/`mut`) referenced-counted variable or field.
- The operation `MUST` be injected before calling a `mutating:` method on an `ISOLATED` (`const`/`mut`) referenced-counted variable or field.
- The operation `MAY` be elided/removed by optimization if the reference count is already provably 1 (e.g. if `ENSURE_UNIQUE` has already been performed due to a previous mutation).
- The operation `MUST NOT` be injected for non-reference-counted values.
- The operation `MUST NOT` be injected for `SHARED` (`ref`/`mutref`) variables or fields.

### Notes on Optimization

`RETAIN` increments the reference count to a minimum of 2, so the next `ENSURE_UNIQUE` `MUST NOT` be elided. `RELEASE` decrements the reference count and deallocates, so after an `ENSURE_UNIQUE`, `RELEASE` sequence there `MUST NOT` be any more references to the variable (except to `ASSIGN` it a new value).

## Rules for Backend

- If the reference-count of the `object` is greater than one, a copy `MUST` be made.
- If the reference-count is exactly one, copying `MUST NOT` be made.
- The variable/field indicated by the `object` property `MUST` be modified to reference the new allocation.
- The new allocation `MUST` have a reference count of exactly 1.
- The reference count of the original allocation `MUST` be decremented by exactly 1.

### Notes on Optimization

`ISOLATED` variables and fields `MAY` be stored on the stack which would render copy-on-write strategies impossible. In that case values `MUST` be copied immediately by the `ASSIGN` operation, and `ENSURE_UNIQUE` `MUST` be ignored as a no-op.
