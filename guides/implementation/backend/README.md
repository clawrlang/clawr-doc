# Clawr Backend Implementation

This document describes the implementation of the [Clawr example compiler](https://github.com/clawrlang/clawr).

The [Clawr example compiler](https://github.com/clawrlang/clawr) is separated in two parts, a [frontend](../frontend/README.md) and a [backend](./README.md). The protocol between the two is described in the [official specification](../../../spec/cir/README.md).

This section discusses the backend implementation.

> [!warning]
> The example compiler is mostly an early proof-of-concept implementation. Do not treat it as official. You should also not assume that production compilers will necessarily be based on it.
>
> The only strictly defined “Clawr” is the source code syntax, the CIR, and the semantic meaning therein.

## Integer Representation

The example backend represents an `integer` as an unboxed `int64_t` only if its CIR range has both bounds within ±(2⁶³−1). Unbounded or larger ranges use `Integer*`. The range is symmetric because `Integer` digits cannot represent `INT64_MIN`.

This is an implementation choice. The specification only requires that [implicit boxing](../../../spec/cir/arc.md#boxing) is backend-private and preserves value semantics.
