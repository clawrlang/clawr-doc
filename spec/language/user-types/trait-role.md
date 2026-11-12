&nbsp; / &nbsp; [The Clawr Language](../README.md) &nbsp; / &nbsp; [User-Defined Types](./README.md)

# Traits and Roles

> [!quote] FAQ
>
> _What is the difference between a `trait` and a `role`? They both seem to do the same thing. Aren’t they both interfaces?_
>
> — Frequently asked question

Technically, syntactically, and maybe even semantically, traits and roles are indeed the same thing. The runtime implementation will be identical. The [Intermediate Representation (CIR)](../../cir/README.md) between compiler frontend and backend does not change.

The difference is conceptual. A `trait` hides irrelevant data and emphasises essential information; a `role` hides technical details and signals abstract capability.

- A `trait` marks a constitutional property about a value. It applies to value types, not to services.
- A `role` describes a capability, a responsibility. It is primarily intended for services.

| Type Class                     | `trait` Conformance | `role` Embodiment |
| ------------------------------ | ------------------- | ----------------- |
| Value-type (`object` / `data`) | Intended Use        | Possible (rare)   |
| Service type (`service`)       | Not Meaningful      | Intended Use      |

## No Static Elements

A `trait` or `role` `MUST NOT` define “static” elements or initializers. Polymorphic construction is expressed through factory `service`s or `role`s instead.

A `trait` applies only to value types (see [below](#a-trait-is-only-applicable-to-value-types)). Any type can embody a `role`. The rationale is documented in [ADR-009](../../../adr/adr-009.md) and [ADR-014](../../../adr/adr-014.md).

## The `trait` Concept

A `trait` is a model type. Just like both `object` and `data`, it can apply to isolated and shared-reference variables as needed. It can also be returned as _uniquely referenced return values_, assigned value semantics or reference semantics by the caller.

Example traits (from the standard library) include:

- `HasStringRepresentation` (can be used in `string` interpolation)
- `Serializable` (JSON, YAML, XML, Apple plist, binary/ternary data-stream…)
- `HashEquatable` (can be used as lookup key in dictionaries)
- `Equatable` and `Ordered` (can be compared to others of its type)
- `Iterable` (can be used as the iterated collection in a `for`-`in` loop)

### A `trait` is only Applicable to Value-Types

Traits are only applicable to `object` and `data` types and to boxed primitives. Scalar types and structures we might call “value types.” They are not applicable to `service` types, which represent capabilities rather than encapsulated state.

> [!warning]
>
> Do not mistake Clawr value types for .Net value types. See the [theory on value types](../../../guides/theory/value-type.md) for more details.

A service that exists to execute processes is not a “value,” and types that describe such capabilities are not “value-types.” Hence they cannot conform to traits.

## The `role` Concept

A `role` is a capability or responsibility that a structure can embody. While any type can theoretically conform to a `role`, it is primarily intended for `service`s. This is because to embody a `role`, types may require access to the environment, which is not permitted for value types.

Like a `service`, a `role` is presumed to interact with the environment and therefore cannot be isolated. It is only allowed to be assigned to `ref T` variables.

Example roles include:

- Managers (like a `UserAccessManager`)
- Repositories (`UserRepository`, `FriendsGraph`)
- Message sending capability (`SMSSender`, `EmailService`…)
- The _Strategy_ pattern

These names could just as well refer to `service` types, but the `role` abstraction allows for more flexible and decoupled designs, especially when it comes to testing and dependency injection.

### A `role` is Primarily for Services

While any type can theoretically embody a `role`, it is primarily intended for `service`s. This is because `role`s often require access to the environment, which cannot be structurally isolated, and therefore must be assigned to `ref T` variables.

An `object` or `data` type can technically embody a `role`, but it is probably rare in production code due to their limited practical utility. It can however be very helpful in testing, prototyping, or other scenarios where environmental interactions are simulated. In such cases, the `role` acts as a seam for dependency injection, allowing a value-type to fulfill the expected interface without requiring actual interactions with the environment.
