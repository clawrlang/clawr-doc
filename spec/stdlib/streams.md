&nbsp; / &nbsp; [Clawr Standard Library](./README.md)

# Logical Lane Streams

Lane streams transfer ordered sequences of logical states, independently of hardware words, storage radix, text encoding, and transport framing. Binary and ternary streams are separate capabilities until generics are specified. The executable declarations are in [lane-streams.clawr](./src/lane-streams.clawr).

## Input and output roles

```clawr
role BitfieldInput {
    func readSome(maxLanes: integer) -> bitfield
    func close()
}
role BitfieldOutput {
    func write(_ value: bitfield)
    func close()
}
```

`TritfieldInput` and `TritfieldOutput` have the corresponding `tritfield` signatures. Roles are shared capabilities, passed as `ref BitfieldInput`, for example.

- Counts measure logical lanes, never octets or backend storage units.
- `readSome(maxLanes:)` requires a positive count representable by the runtime. It blocks until it can return at least one lane, reaches EOF, or fails. A successful result contains at most the requested number of lanes.
- An empty result means EOF. EOF is terminal; subsequent valid reads also return an empty field of the stream's kind. A short nonempty read does **not** imply EOF.
- Reads preserve source order; the first returned lane is the next unread lane. Results are owned field values, not mutable views into a stream.
- `write(_:)` consumes all lanes in displayed order or fails. The field kind must match the stream. An empty field is a valid no-op on an open stream.
- Chunk boundaries carry no record semantics. Repartitioning reads or writes preserves the same lane sequence. There is no implicit padding or conversion between binary and ternary states.
- Aliases share the cursor, accumulated output, and closed state. Closing through one alias closes the endpoint for all aliases. Reads, writes, and repeated closes on a closed endpoint fail. Explicit close finalizes pending output.
- Failures currently panic, including invalid counts, premature EOF in exact reads, invalid handles, allocation failures, and operations on closed endpoints. Errors are never represented as EOF or successful empty output. Partial effects may precede a failure; no rollback is promised.

Nonblocking operations, seeking, concurrent use, asynchronous cancellation, and structured errors are not part of this initial contract.

## Exact reads

```clawr
func readBitfieldExactly(_ input: ref BitfieldInput, count: integer) -> bitfield
func readTritfieldExactly(_ input: ref TritfieldInput, count: integer) -> tritfield
```

Counts must be positive and representable, as for `readSome`. These helpers loop over short reads until the requested number of lanes has been assembled. Premature EOF panics; already consumed lanes are not restored. A provider returning more than the requested maximum is also an error. No padding is added. In particular, algorithms may request 9 or 27 trits without depending on storage words or producer chunk sizes.

## In-memory endpoints

```clawr
const input = newMemoryTritfieldInput(0tT01_T01_T01)
const output = newMemoryTritfieldOutput()
const block: tritfield(9) = readTritfieldExactly(input, count: 9)
output.write(fieldSlice(block, 0, 2))
output.write(fieldSlice(block, 2, 7))
output.close()
const restored = output.result()
input.close()
```

`newMemoryBitfieldInput(_:)` and `newMemoryBitfieldOutput()` provide the binary counterparts. Factories return owned shared opaque services conforming to their respective input/output roles.

Inputs retain an immutable snapshot of the supplied field. Reassigning or releasing the original value does not affect the source. A memory source returns the requested number of lanes or its remaining suffix, whichever is shorter. The role contract also permits other providers to return earlier short reads.

Outputs start empty. `result()` returns an owned immutable snapshot of all lanes written so far, without closing the endpoint. Snapshots are unaffected by later writes or handle destruction. Retrieving the result is permitted both before and after close; it is not an input read and does not advance a cursor.

Memory handles cannot be constructed directly, subclassed, or copied using `copy(of:)`. Their final release frees retained fields automatically, even if explicit close was omitted. Explicit close of an input releases its retained source; closed outputs retain their result until final release. There is no alignment restriction, including on final output length.

Runtime-backed free functions in the executable declarations implement opaque endpoint methods and exact-read validation. They are implementation machinery; applications should use the roles, factories, methods, and exact-read helpers. No complexity or buffering-size guarantee is specified for this initial in-memory implementation.

## File and text adapters

The existing [octet file API](./README.md#octet-file-streams) is unchanged and does not yet implement these roles. Its counts remain octets, and its short reads still indicate the final chunk.

A future binary file adapter may buffer partial octets across calls: writing three lanes followed by five lanes can produce one octet. Final non-octet lengths require an explicit error, padding, or length/framing policy. Ternary files need a separately specified encoding. These decisions do not constrain in-memory lane lengths.

Text encoders/decoders, JSON parsing, file adapters, and native ternary storage adapters remain separate work; logical streams do not select them implicitly.
