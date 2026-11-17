&nbsp; / &nbsp; [Clawr Standard Library](./README.md)

# Standard library sources

The standard-library declarations are Clawr source files listed, in order, by
[`manifest.json`](./manifest.json.md). The list is the complete set of sources
for this revision. An implementation reads them in the listed order; named
aliases must be declared before they are used.

- [subsets.clawr](./subsets.clawr.md)
- [traits.clawr](./traits.clawr.md)
- [truthvalue.clawr](./truthvalue.clawr.md)
- [serialization.clawr](./serialization.clawr.md)
- [io.clawr](./io.clawr.md)

The files contain declarations and executable Clawr implementations provided by this revision. An implementation must include executable stdlib declarations in program CIR or compile and link them separately, without duplicating runtime-owned interface identities. Runtime-backed
`extern` functions and traits also require matching implementation and ABI
support. The reference may describe additional features that are not yet
available in these declarations.

The manifest and declarations do not require a particular host language or
package manager. Implementations should pin the documentation revision they
consume.
