<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Standard Library

The Clawr standard library contains some basic functionality.

## `copy(of:)`

```clawr
func copy<T: RC>(of value: T) -> T
```

Typically used to transfer a reference-counted `value` to a different isolation level, but can also be used to force new copies of `SHARED` structures. The return-value will be a uniquely referenced (`refs = 1`) value that can be assigned to either a `ref`/`mutref` OR a `const`/`mut` variable locking it in to the selected isolation level.

Example:

```clawr
const x: MyData = { a: 12 } // ISOLATED variable
ref y = copy(of: x) // SHARED variable
```

> [!note]
>
> Clawr does not yet define a syntax for generic type parameters. The above is speculative at best.

### Rules for Frontend

- The CIR `MUST` wrap the returned value in as `AS_SHARED` structure if the assignment target is a `SHARED` (`ref`) variable/field/parameter. It `MUST NOT` wrap in `AS_SHARED` if the target is `ISOLATED`.

### Rules for Backend

- This function `MUST` be implemented in the runtime to make a full copy of the root structure.
- The function `MAY` reuse reference-counted child structures if they are implemented as separate allocations and all `RETAIN`ed.
- The backend `MAY` inline `ISOLATED` children in the parent structure, but `MUST NOT` maintain a separate reference count for them.

## `Equatable`

> [!warning]
>
> **Not Implemented**
>
> Awaiting `trait` support

Values that can be compared for equality (`==`).

```clawr
trait Equatable {
  func equals(other: Self) -> boolean
}
```

## `HashEquatable`

> [!warning]
>
> **Not Implemented**
>
> Awaiting `trait` support
> Needs design work

Values that can be used in hash-sets and as keys in dictionaries.

```clawr
trait HashEquatable: Equatable {
  func hashCode() -> integer
}
```

This should be redesigned to force the use of a `HashCode` algorithm that is implemented by the runtime. Combining hash-codes from multiple fields should perform a mixing operation that makes similar hashes unlikely. E.g. `hash = (hash * 31 + value) % size`. The implementation should generate the prime factor at program launch so that it cannot be used maliciously.

## `HasStringRepresentation`

> [!warning]
>
> **Not Implemented**
>
> Awaiting `trait` support

Values that can be used in interpolated `string` literals and `print`ed to the console.

```clawr
trait HasStringRepresentation {
  func toString() -> string
}
```

`asString()`? `description()`?

## `Identifiable`

> [!warning]
>
> **Not Implemented**
>
> Awaiting `trait` support

Values that can be compared for identity (`===`).

```clawr
trait Identifible {
  func id() -> Equatable
}
```

## `Ordered`

> [!warning]
>
> **Not Implemented**
>
> Awaiting `trait` support

Values that can be compared and ordered (`<`, `>`).

```clawr
trait Ordered {
  func isOrderedBefore(other: Self) -> boolean
}
```

## `print(_:)`

Prints a string value to `stdout`.

```clawr
func print(_ value: HasStringRepresentation)
```
