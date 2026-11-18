# Standard Library

The Clawr standard library contains Clawr implementations and runtime-backed declarations. Implementations `MUST` compile and link executable stdlib code as well as provide the declared runtime operations.

## Serialization

[`Serializable`, `Serializer`, and `JSONSerializer`](./serialization.md) provide format-independent value serialization and JSON string output. `serializeJSON(_:)` is the convenience entry point.

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

Equal values `MUST` hash equally in the same context. Hash collisions do not prove equality, and equality-relevant key state `MUST` remain stable while stored.

The program is expected to ensure that the `hash(into:)` method is implemented consistently with the `equals` method for all `HashEquatable` types, but neither the frontend nor the backend can enforce this automatically.

The best way to ensure consistency between `hash(into:)` and `equals` is to use the same set of components for both methods. And to always feed these components into the `HashBuilder` in a consistent order. (If this can be simplified or automated, it should be, but at this time it is left to the programmer.)

## `HashBuilder`

Backend-provided opaque service that accumulates hash contributions without exposing their representation.

```clawr
// Defined by backend
opaque service HashBuilder {
  extern func add(_ value: HashEquatable)
}

extern func newHashBuilder() -> ref HashBuilder
```

Builders are shared ARC-managed resources. Parameters borrow them and aliases contribute to the same stream. Literal construction, subclassing and `copy(of:)` are not permitted. Only the runtime-owned `clawr.HashBuilder` opaque service and the serialization implementation's `clawr.JSONBuffer` are supported. Integer, real, truthvalue and string contributions use canonical primitive witnesses; other values delegate to their `hash(into:)` implementation.

Hash results are not portable or stable across processes, backends, or runtime versions and `MUST NOT` be used as persistent identifiers. The frontend `MUST NOT` assume a particular hash width, base, or representation.

The builder and factory are currently visible to programs; restricting them to collection implementations is deferred until the visibility model is designed. Collections and public Clawr hash results are not yet specified. See the [example backend's hashing implementation](../../guides/implementation/backend/hashing.md) for runtime-specific details.

> [!note] For Future Consideration
>
> If [Varargs Functions](../../adr/drafts/varargs.md) are adopted, the standard library may provide a convenience method for adding multiple values in a single call. Extensions are already specified; see [Extensions](../language/user-types/extensions.md).
>
> ```clawr
> extension HashBuilder {
>   func addInOrder(...values: HashEquatable) {
>     for (const value in values) self.add(value)
>   }
> }
> ```

### `HashCode`

This is a later-stage design, not an implemented Clawr type. Public `mixedValue() -> HashCode` is deferred with it.

Opaque, backend-defined type (or subset). `MAY` be an alias for `integer(0..<2^64)`, or some other range. `MAY` be a `data` or `object` type. `MAY` be a `bword` or `tword`. `MAY` be implemented in any way that suits the backend. The exact implementation is irrelevant as long as it can be used for hash lookups.

```clawr
opaque type HashCode
```

The `HashCode` type should not be visible to programmers. It is intended to be used only by collection types in the standard library. It is intended to be implemented by the backend/runtime only and used indirectly by collection algorithms.

Collection algorithms use an `extern` function, `bucketIndex(hash:,max:)` to convert a `HashCode` into a useful index for lookups. Other than that, the value is opaque and should not be manipulated directly.

### `bucketIndex(hash:,max:)`

Deferred with `HashCode`. A future backend-owned `CollectionIndex`, with frontend semantics `integer(0...)`, could preserve identity in CIR for fixed-width lowering. Ordinary subset aliases do not preserve that identity today. Positive capacity and representability rules remain to be specified.

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

## Logical lane streams

[Logical lane streams](./streams.md) define separate binary and ternary input and output roles with lane-counted reads, exact-read helpers, and in-memory endpoints. Chunk boundaries do not impose word sizes or wire encodings. These roles do not change the existing octet file API below.

## Octet file streams

The first file-stream API uses an explicit **MSB-first octet encoding** of
`bitfield`, not the field's in-memory representation.

```clawr
opaque service OctetInput {}
opaque service OctetOutput {}

extern func openOctetInput(_ path: string) -> ref OctetInput
extern func openOctetOutput(_ path: string) -> ref OctetOutput
extern func readOctets(_ input: ref OctetInput, count: integer) -> bitfield
extern func writeOctets(_ output: ref OctetOutput, value: bitfield)
extern func closeOctetInput(_ input: ref OctetInput)
extern func closeOctetOutput(_ output: ref OctetOutput)
```

### Encoding and chunk boundaries

One octet maps to eight consecutive binary lanes, with its most significant bit first: octet `0x80` maps to `10000000`, `0x01` to `00000001`, and `0x00` to `00000000`. Octets appear in stream order. Encoding reverses that mapping. Neither host endianness nor internal word boundaries affect the wire bytes. No text conversion, framing, length header, or padding is added. Every octet value is valid input.

Writes require a binary field whose length is a multiple of eight; the empty field is valid and writes nothing. Non-aligned fields are rejected, not padded. The application must specify its own framing and any treatment of partial octets. Ternary fields require a separately defined encoding and are not accepted by this API. These operations do not interpret fields as integers.

`readOctets` requests a **positive maximum count of octets**, not lanes. It reads that many octets unless it reaches EOF or encounters an error. The returned field has eight times the actual octet count as its length. A short field is the final chunk, and an empty field means EOF. Further reads at EOF also return empty fields. Zero and negative counts are invalid, and counts or resulting allocations beyond runtime limits panic.

The count is chosen by the caller, not by the hardware. Concatenating decoded chunks preserves the same lane sequence as decoding the complete stream. Any algorithm-specific 9- or 27-lane blocks must be assembled separately with field slicing and concatenation; file read boundaries do not define them.

### File effects, ownership, and errors

Opening input requires an existing readable file. Opening output creates a file or **truncates an existing one**. Paths must not contain embedded NUL. These are blocking binary file operations; seeking, append mode, non-blocking streams, and concurrency guarantees are not provided by this initial API.

Handles are opaque shared services: aliases refer to the same cursor and closed state. They cannot be constructed, copied with `copy(of:)`, subclassed, or inspected by user code. Closing through any alias closes the resource for all aliases. Reading, writing, or closing an already closed handle is an error. The runtime also closes an unclosed resource when its final reference is released. Explicitly close output to observe errors from buffered writes before proceeding.

Open, read, write, flush/close, allocation, and invalid-input failures panic and terminate the process; they are not reported as EOF or successful empty results. A failed operation may already have consumed input or written part of the output. No rollback or atomic replacement is promised. Structured errors are deferred until the language supports them.

For example, this copies an octet file in caller-selected chunks. Use distinct input and output files, since opening output truncates it:

```clawr
const source = openOctetInput("input.bin")
const destination = openOctetOutput("copy.bin")
mut chunk: bitfield = readOctets(source, count: 4096)
while fieldLength(chunk) > 0 {
    writeOctets(destination, value: chunk)
    chunk = readOctets(source, count: 4096)
}
closeOctetInput(source)
closeOctetOutput(destination)
```

The reference C backend currently requires eight-bit host bytes for this file adapter. Other backends must implement the same logical octet mapping rather than expose their native binary or ternary storage.

## Truthvalue operations

```clawr
func rotate(_ value: truthvalue, by amount: truthvalue) -> truthvalue
func adjust(_ value: truthvalue, towards direction: truthvalue) -> truthvalue
func modulate(_ value: truthvalue, by factor: truthvalue) -> truthvalue
```

These operations perform mod-3 addition, clamped addition, and multiplication respectively, as defined in the [truthvalue specification](../language/builtin-types/truthvalue.md#logical-operators).
