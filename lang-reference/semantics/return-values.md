<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Isolation Levels for Function Return Values

Functions can return memory they just allocated, memory that they receive from somewhere else, or memory stored as a field. That memory could have `ISOLATED` or `SHARED` semantics. But functions should be reusable whether the caller assigns the result to a `const` or a `ref` variable. To resolve this, Clawr uses _uniquely referenced values_ where possible.

```clawr
func returnsShared() -> ref Student // SHARED memory
func returnsIsolated() -> const Student // ISOLATED memory
func returnsUnique() -> Student  // ISOLATED memory with a reference count of 1
```

## Uniquely Referenced Values

Functions return “uniquely referenced” values by default. A uniquely referenced value is an `ISOLATED` memory block that has a reference count of exactly one. It is assumed that the value will be assigned to a variable, which is is already counted. If it is not, it must be `RELEASE`d (i.e. deallocated) by the caller.

A uniquely referenced value can be “upgraded” to reference (`SHARED`) semantics. If the caller assigns the value to a `const` or `mut` variable, the memory is awarded `ISOLATED` semantics. If it is assigned to a `ref` variable, it is given `SHARED` semantics. Once the value has been assigned, the semantics is locked until it is deallocated (or returned again as a uniquely referenced `ISOLATED` value). It can also be passed to a `(default)` parameter (where the semantic mode is irrelevant) — as described in the [Function Parameters](./function-parameters.md) document.

Uniquely referenced values will effectively be `ISOLATED`. This is a consequence of the fact that `SHARED` values will always have multiple references. If, for example, your method returns the value of a `ref` field, that field will hold one reference, and for the caller to be able to hold a reference, the count must be at least two.

## Return Values are _Moved_

Reference-counted values will be deallocated as soon as the counter reaches zero. Therefore, it is impossible for the called function to count down _all_ its references and then return the value. It must leave a reference count of one (even though it technically holds zero references). That means that the caller must adjust _its_ behaviour accordingly. It just takes over the reference without counting up. If it does not store the value (for example if it just passes it to another function, or uses it for computation etc) it must subsequently `RELEASE` the value so that the memory does not leak.

## Factory Functions

Clawr does not have constructors like other OO languages, but does have `data` literals and factory functions.

A factory is just a free function (or a “static method”) that creates a uniquely referenced entity. This can be assigned as needed to a `SHARED` or `ISOLATED` variable, field or function parameter which locks its semantics down as described above.
