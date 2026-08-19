<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Clawr Intermediate Representation : Statements : `ENSURE_UNIQUE`

An `ENSURE_UNIQUE` statement is injected to preserve isolation between copy-on-write variables and fields. When assigning a variable/field to another, the value does not need to be copied immediately. Aliasing is allowed. When one of the references is modified however, it `MUST` be relocated (using `ENSURE_UNIQUE`) before the change is applied.

```ts
type EnsureUnique = {
  kind: 'ENSURE_UNIQUE'
  object: Storage
}

type Storage = VariableReference | FieldReference
```

## Rules for Frontend

- The operation `MUST` be injected before editing an `ISOLATED` referenced-counted variable or field.
- The operation `MUST NOT` be injected for `SHARED` values.
- The operation `MUST NOT` be injected for non-reference-counted values.
- The operation `MAY` be elided/removed by optimization if the reference count is already provably 1 (e.g. if `ENSURE_UNIQUE` has already been performed due to a previous mutation).

## Rules for Backend

- If the reference-count of the `object` is greater than one, a copy `MUST` be made.
- If the reference-count is exactly one, copying `MUST NOT` be made.
- The variable/field indicated by the `object` property `MUST` be relocated to reference the new allocation.
- The new allocation `MUST` have a reference count of exactly 1.
- The reference count of the original allocation `MUST` be decremented by exactly 1.

