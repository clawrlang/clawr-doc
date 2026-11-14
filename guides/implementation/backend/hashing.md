&nbsp; / &nbsp; [Backend Implementation](./README.md)

# Hashing in the Example Backend

The portable API and behavioral contract are defined in the [standard library](../../../spec/stdlib/README.md#hashequatable). This page describes the example C backend and runtime, not requirements on every backend.

The runtime uses SipHash-2-4 with a securely generated process-wide key. Primitive framing preserves component boundaries. Numeric contributions normalize the coefficient and prime exponents without expanding the value's magnitude, so equal supported numeric representations have equal contributions.

Runtime-only finalization snapshots the builder without consuming it. Repeated snapshots of unchanged state agree, and further additions remain valid. There is no public Clawr `HashCode`, `mixedValue()`, or bucket-index API yet; runtime tests exercise finalization until collections are implemented.

