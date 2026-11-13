# Standard Library

The Clawr standard library is implemented by the backend. It contains some basic functionality. The backend/runtime `MUST` add implementation for all these declarations.

## `copy(of:)`

> [!warning] Not Implemented — Needs design work
>
> Clawr does not yet define a syntax for generic type parameters. See [the ADR Sketch on Generics](../../adr/drafts/generics.md)

```clawr
func copy<T: RC>(of value: T) -> T
```

Typically used to transfer a reference-counted `value` to a different isolation level, but can also be used to force new copies of `SHARED` structures. The return-value will be a uniquely referenced (`refs = 1`) value that can be assigned to either a `ref`/`mutref` OR a `const`/`mut` variable locking it in to the selected isolation level.

Example:

```clawr
const x: MyData = { a: 12 } // ISOLATED variable
ref y = copy(of: x) // SHARED variable
```

### Rules for Frontend

- The CIR `MUST` wrap the returned value in an `AS_SHARED` structure if the assignment target is a `SHARED` (`ref`) variable/property/parameter. It `MUST NOT` wrap `AS_SHARED` if the target is `ISOLATED`.

### Rules for Backend

- This function `MUST` be implemented in the runtime to make a full copy of the root structure.
- The function `MAY` reuse reference-counted child structures if they are implemented as separate allocations and all `RETAIN`ed.
- The backend `MAY` inline `ISOLATED` children in the parent structure, but `MUST NOT` maintain a separate reference count for them.

## `Equatable`

Values that can be compared for equality (`==`) against another value of the same type. Values that conform to both `Equatable` and `Ordered` can also be compared using “-or-equal” operators (`<=`, `>=`).

```clawr
trait Equatable {
  func equals(other: Self) -> boolean
}
```

## `HashEquatable`

> [!note] Contribution API implemented; collections and Clawr hash results deferred
>
> Tracked by [ADR-037](../../adr/adr-037.md) Hashing and `HashEquatable`
>
> The exact hashing algorithm is backend-specific, but it `MUST` be consistent with the `HashEquatable` contract.

Values that can be used in hash-sets and as keys in dictionaries.

```clawr
trait HashEquatable: Equatable {
  func hash(into builder: HashBuilder)
}
```

A `HashEquatable` type `MUST` also be `Equatable`. The idea is to locate a value by its hash-code first and then confirm equality using the `equals` method.

Equal values MUST hash equally in the same context. Hash collisions do not
prove equality, and equality-relevant key state must remain stable while stored.

The program is expected to ensure that the `hash(into:)` method is implemented consistently with the `equals` method for all `HashEquatable` types, but neither the frontend nor the backend can enforce this automatically.

The best way to ensure consistency between `hash(into:)` and `equals` is to use the same set of components for both methods. And to always feed these components into the `HashBuilder` in a consistent order. (If this can be simplified or automated, it should be, but at this time it is left to the programmer.)

## `HashBuilder`

Backend-provided service that mixes multiple `HashCode` values into a single value.

```clawr
// Defined by backend
opaque service HashBuilder {
  extern func add(_ value: HashEquatable)
}

extern func newHashBuilder() -> ref HashBuilder
```

Builders are shared ARC-managed resources. Parameters borrow them and aliases
contribute to the same stream. Literal construction, subclassing and
`copy(of:)` are not permitted. Only the runtime-owned `clawr.HashBuilder`
opaque service is supported initially. Integer, real, truthvalue and string
contributions use canonical primitive witnesses; other values delegate to
their `hash(into:)` implementation.

The C backend uses SipHash-2-4 with a securely generated process-wide key.
Snapshot finalization exists only in the runtime for now; it does not consume
the builder and adding further values remains valid.

> [!note] For Future Consideration
>
> When/if the [Extensions](../../adr/drafts/extensions.md) and [Varargs Functions](../../adr/drafts/varargs.md) ADRs are adopted, the standard library may provide a convenience method for adding multiple values in a single call.
>
> ```clawr
> extension HashBuilder {
>   func addInOrder(...values: HashEquatable) {
>     for (const value in values) self.add(value)
>   }
> }
> ```

### `HashCode`

This is a later-stage design, not an implemented Clawr type. Public
`mixedValue() -> HashCode` is deferred with it.

Opaque, backend-defined type (or subset). `MAY` be an alias for `integer(0..<2^64)`, or some other range. `MAY` be a `data` or `object` type. `MAY` be a `bword` or `tword`. `MAY` be implemented in any way that suits the backend. The exact implementation is irrelevant as long as it can be used for hash lookups.

```clawr
opaque type HashCode
```

The `HashCode` type should not be visible to programmers. It is intended to be used only by collection types in the standard library. It is intended to be implemented by the backend/runtime only and used indirectly by collection algorithms.

Collection algorithms use an `extern` function, `bucketIndex(hash:,max:)` to convert a `HashCode` into a useful index for lookups. Other than that, the value is opaque and should not be manipulated directly.

### `bucketIndex(hash:,max:)`

Deferred with `HashCode`. A future backend-owned `CollectionIndex`, with
frontend semantics `integer(0...)`, could preserve identity in CIR for
fixed-width lowering. Ordinary subset aliases do not preserve that identity
today. Positive capacity and representability rules remain to be specified.

Converts a `HashCode` into a usable index for hash-based collections. The result `MUST` satisfy `0 <= result < max`.

```clawr
extern func bucketIndex(hash: HashCode, max: integer) -> integer
```

> [!note] Future Extension Under Consideration
>
> ```clawr
> extension HashCode {
>     func bucketIndex(max: integer) => bucketIndex(hash: self, max: max)
> }
> ```

### Rules for Backend

- The runtime `MUST` securely generate a secret process-wide key for its keyed hash. Randomizing a multiplier alone is not a sufficient security design.
- The backend `MUST` ensure that the `hash(into:)` method produces consistent results for the same input components, in the same order, within a single program execution.
- The `add(_:)` method `MUST` detect boxed primitive values and convert them into a `HashCode` using backend-defined mechanisms, mixing them into the aggregate hash state.
- The `add(_:)` method `MUST` delegate to `hash(into:)` and not attempt any further processing itself if the value is not a boxed primitive.

## `HasStringRepresentation`

Values that can be used in [interpolated `string` literals](../../adr/drafts/string-interpolation.md) and [`print`ed to the console](#print_).

```clawr
trait HasStringRepresentation {
  func stringRepresentation() -> string
}
```

## `Ordered`

Values that can be compared and ordered (`<`, `>`). Values that conform to both `Ordered` and `Equatable` can also be compared using “-or-equal” operators (`<=`, `>=`).

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

## Truthvalue operations

```clawr
func rotate(_ value: truthvalue, by amount: truthvalue) -> truthvalue
func adjust(_ value: truthvalue, towards direction: truthvalue) -> truthvalue
func modulate(_ value: truthvalue, by factor: truthvalue) -> truthvalue
```

These operations perform mod-3 addition, clamped addition, and multiplication
respectively, as defined in the [truthvalue specification](../language/types.md#logic-operators).
