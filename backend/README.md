# Clawr: Backend Developer Documentation

Clawr is defined in terms of syntax and semantics. In a way, you could say that Clawr is merely a compiler frontend. It does not define an ABI, nor does it have an official runtime. This is purposeful as Clawr tries to emphasise modelling, business rules and semantics, while de-emphasising hardware and other technical concerns.

- The same Clawr source code should work regardless of physical hardware or OS
- Primitive Clawr types do not assume binary hardware, but allows e.g. ternary
- Clawr’s type system does not dictate any specific bit — or trit — sizes

But a frontend is not enough. Every compiler needs a backend or the code could not be executed by the hardware. This document targets developers who want to make Clawr useful for their own hardware as well as those who believe that they can make better optimisations than existing backends offer.

Clawr can target any general-purpose computer that implements von Neumann, Harvard, or other architectures, as long as they are computationally universal and a backend exists that can translate the SST to machine code.

## The SST

The Clawr frontend generates a [*semantic syntax tree*](./sst.md) (SST). This is a data structure that represents the source code, but where any disambiguation has been resolved. Inferred type declarations are made explicit, syntax sugar has been reinterpreted, and memory management instructions have been injected. The SST is a formalised, structured version of the more human source code.

The backend’s responsibility is to “lower” the SST to machine code. What exact technologes and strategies it employs to achieve this are of no matter. What does matter however is that the semantics of Clawr is honoured. This documentation uses [IEEE 2119 syntax](https://www.rfc-editor.org/info/rfc2119/) to indicate when the backend `MUST` or `MUST NOT` implement certain behaviour and when it `MAY` choose as it pleases. It also uses `WILL` and `WILL NOT` for equivalent requirements — promises — regarding the input structure.

## General Constraints

There are some constraints that the backend must adhere to:

- **reference-counting**: Clawr employs reference counting. When allocated memory has zero referents, the memory MUST be deallocated.
- **memory layout**: A backend MAY choose its own memory layout, but field access MUST remain semantically consistent.
- **arbitrary-precision**: An unconstrained `integer` or `real` MUST be able to store any value (as long as there is enough available memory). Constrained value-sets allow the backend to optimise storage for “small” values (values that fit in `double`, `uint64_t` etc, or whatever finite-size types the backend uses).
    - **arbitrary-precision algorithms**: A backend MAY choose its own arbitrary-precision algorithms.
    - **unsupported unconstrained values**: A backend MAY disallow unconstrained numeric types globally to avoid arbitrary-precision support, but in that case it MUST report an error when such types or value-sets are defined.

## Other Documentation

- Shared reference documentation: [reference/README.md](../reference/README.md)
- [SST specification](./sst.md)
