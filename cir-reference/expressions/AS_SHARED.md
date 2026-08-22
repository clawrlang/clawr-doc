<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `AS_SHARED`

[CIR](../README.md) : [Expressions](./README.md)

Upgrade a uniquely referenced `ISOLATED` value to a `SHARED` entity.

```ts
type AsShared = {
  kind: 'AS_SHARED'
  object: FunctionCall & Expression
  value: RCTypeLattice
}
```

## Rules for Frontend

- The reference count of the `object` value `MUST` be exactly 1.

## Rules for Backend

- The backend `MAY` create a copy of the value or just modify an isolation flag on the value.
- The backend `MAY` collapse the structure and pass a flag into the function implementation instead. But in that case, it `MUST` pass the equivalent of `ISOLATED` to that function whenever the `AS_SHARED` structure does not wrap the call.
- The backend `MAY` ignore the wrapper entirely if it does not track isolation-levels for allocations. But it `MUST` still perform the wrapped function `CALL`.
