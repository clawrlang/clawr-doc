<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Standard Library

The Clawr standard library is implemented by the backend. It contains some basic functionality. The backend/runtime `MUST` add implementation for all these declarations.

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

- The CIR `MUST` wrap the returned value in an `AS_SHARED` structure if the assignment target is a `SHARED` (`ref`) variable/field/parameter. It `MUST NOT` wrap `AS_SHARED` if the target is `ISOLATED`.

### Rules for Backend

- This function `MUST` be implemented in the runtime to make a full copy of the root structure.
- The function `MAY` reuse reference-counted child structures if they are implemented as separate allocations and all `RETAIN`ed.
- The backend `MAY` inline `ISOLATED` children in the parent structure, but `MUST NOT` maintain a separate reference count for them.

## `Equatable`

Values that can be compared for equality (`==`) against another value of the same type.

```clawr
trait Equatable {
  func equals(other: Self) -> boolean
}
```

## `HashEquatable`

> [!warning]
>
> **Not Implemented** — Needs design work
>
> Unsure how this should work. A `HashCode` cannot be defined by the Clawr specification or the frontend — it `MUST` be platform (i.e. backend) specific. But it must also be usable in sets and dictionaries. So the hash-lookup algorithm must also be backend specific.

Values that can be used in hash-sets and as keys in dictionaries.

```clawr
trait HashEquatable: Equatable {
  func hashCode(using builder: HashBuilder) -> HashCode
}
```

This should be redesigned to force the use of a `HashCode` algorithm that is implemented by the runtime. Combining hash-codes from multiple fields should perform a mixing operation that makes similar hashes unlikely. E.g. `hash = (hash * 31 + value) % size`. The implementation should generate the prime factor at program launch so that it cannot be used maliciously.

### Rules for Backend

- The algorithm `MUST` randomize parameters such as prime factors at program launch.

## `HashCode`

Backend-defined type (or subset). `MAY` be an alias for `integer(0..<2^64)`, or some other range. `MAY` be a `data` or `object` type. `MAY` be a `bword` or `tword`. `MAY` be implemented in any way that suits the backend. The exact implementation is irrelevant as long as it is comparable and can be used for hash lookups.

```clawr
extern type HashCode: Equatable
```

## `HashBuilder`

Backend-provided service that mixes multiple `HashCode` values into a single value.

```clawr
// Defined by runtime
role HashBuilder {
  func add(_ code: HashCode)
  func mixedValue() -> HashCode
}
```

```clawr
// Defined by frontend?
companion HashBuilder {
  extern companion func new() -> HashBuilder

  func mix(...values: HashCode) -> HashCode {
    const builder = HashBuilder.new()
    for (const value in values) builder.add(value)
    return builder.mixedValue()
  }
}
```

## `HasStringRepresentation`

Values that can be used in interpolated `string` literals and `print`ed to the console.

```clawr
trait HasStringRepresentation {
  func stringRepresentation() -> string
}
```

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
