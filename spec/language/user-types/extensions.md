&nbsp; / &nbsp; [The Clawr Language](../README.md) &nbsp; / &nbsp; [User-Defined Types](./README.md)

# Extensions

An extension adds methods and optional trait or role conformances to an existing nominal type without changing its stored state.

```clawr
data Rectangle {
    width: integer
    height: integer
}

trait HasArea {
    func area() -> integer
}

extension Rectangle: HasArea {
    func area() => self->width * self->height
}
```

## Eligible Types and Conformances

- An extension target `MUST` be a `data`, `object`, or `service` declared in the current program. Primitive and separately imported types cannot be extended.
- An extension can add methods and, optionally, one trait or role conformance. It `MUST NOT` add stored properties, initializers, or other state.
- At least one of the target type and the trait or role in a conformance extension `MUST` be declared in the current program (though the current implementation requires both). A type may explicitly conform to a given trait or role only once in that program.
- `data` declarations remain property-only. Methods and explicit conformances for `data` types are provided by extensions.
- A `service` may conform to roles, but not traits. Services `MUST NOT` have `mutating` extension methods.

The current program may contain multiple [source modules](../programs.md); extensions and duplicate checks apply across all of them. Separately imported packages and conflict resolution between packages are not yet supported.

## Method Lookup and Dispatch

An extension method is identified by its base name and parameter labels. Duplicate identities on a type are compile-time errors, including conflicts with methods declared on the type, inherited methods, or another extension. An extension `MUST NOT` override a type-declared or inherited method.

Method lookup uses the receiver's static nominal type and its supertype chain. An extension method is called directly using the type that declares it; it does not add a virtual-dispatch slot.

## Mutation

`data` and `object` extensions may declare `mutating` methods. When a mutating method is called on an isolated receiver, the frontend `MUST` emit `ENSURE_UNIQUE` before the call to preserve copy-on-write semantics. Shared (`ref`) receivers are not copied.

The CIR representation and its frontend/backend obligations are specified by [`EXTENSION_DECL`](../../cir/declarations/EXTENSION_DECL.md).
