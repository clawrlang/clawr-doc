# Serialization

`Serializable` describes a value independently of its output format.
`Serializer` is the shared writer capability. Their declarations and the Clawr
JSON implementation are in [serialization.clawr](./serialization.clawr).

Strings, integers, reals, and truthvalues have builtin conformance. Recursively
pure `data` has synthesized conformance; an object or `ref` property anywhere
inside prevents synthesis, regardless of explicit conformance on that property.
An explicit conformance replaces synthesis and must provide a valid method:

```clawr
extension Point: Serializable {
    func serialize(into serializer: ref Serializer) {
        serializer.beginStructure("Point", fieldCount: 2)
        serializer.writeField("x", value: self->x)
        serializer.writeField("y", value: self->y)
        serializer.endStructure()
    }
}
```

Each invocation must write exactly one value. A value is either a scalar
(`writeString`, `writeInteger`, `writeReal`, or `writeTruthvalue`) or a complete
structure. Structure field counts must be nonnegative and equal the number of
written fields. Each field recursively serializes one value. Nested structures
have independent field state; empty structures are valid.

Synthesized methods follow declaration order and pass the canonical type name,
field count, and property names. They use ordinary CIR extension methods and
role calls. There is no format-specific backend synthesis. Serializer
implementations may ignore the type name or field count, but these do not supply
the schema or numeric field identifiers required by some formats.

## JSON strings

```clawr
const json: ref JSONSerializer = {JSONSerializer.new()}
const text: string = json.serialize(value)
```

Alternatively, call `value.serialize(into: json)` followed by `json.result()`.
Both entry points finalize exactly one document. Each service instance is
single-use: it must contain one complete root at finalization and must not be
written or finalized again. The generic `Serializer` role has no result method.
Writer misuse is a runtime programmer error, never a partial-success string.
Runtime-owned buffer storage is released even when a writer is abandoned.

`serializeJSON(value)` constructs a fresh service, serializes the value, and
returns its string. It replaces the former JSON-specific protocol while
retaining this convenience function's name.

- Data structures become JSON objects and property names become keys.
- Strings and keys are escaped, including control characters and embedded NUL;
  Unicode text is preserved.
- Integers become exact decimal number tokens without a digit cap.
- Reals become decimal number tokens sufficient to round-trip at the incoming
  declared precision; they are not coerced to binary64.
- True and false become JSON booleans. An ambiguous truthvalue becomes `null`;
  this JSON-specific policy does not create general nullability.

JSON consumers restricted to binary64 can lose precision when reading large
Clawr numbers. Decoding, arrays/collections, general nullable values, byte
fields, interface extensions, and other built-in formats are deferred.

`JSONSerializer` and recursive field dispatch are implemented in Clawr.
Runtime helpers provide buffer ownership, string escaping, numeric formatting,
punctuation, and nested lifecycle validation. Their opaque `JSONBuffer` is
implementation machinery, not a user-constructible or copyable value.

## Real parameter transport

A formal parameter, including a role requirement, may declare `real` without a
precision. It accepts a real while preserving its precision metadata. Passing
or forwarding that value does not round it. Arithmetic still requires known
precision; stored declarations and declared function results still require
explicit precision. This allows `writeReal(_ value: real)` to support every
implemented precision without selecting a fixed numeric representation.
