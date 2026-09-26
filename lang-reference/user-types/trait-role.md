<!-- markdownlint-disable MD041 MD033 -->
<img src="/images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Traits and Roles

> _What is the difference between a `trait` and a `role`? They both seem to do the same thing. Aren’t they both interfaces?_
> — Frequently asked question

Technically, syntactically, and maybe even semantically, traits and roles are indeed the same thing. The runtime implementation is actually identical. The [CIR](../../cir-reference/README.md) does not change.

The difference is conceptual. A `trait` hides irrelevant data and emphasises essential information; a `role` signals a capability.

- A `trait` marks a constitutional property about a value. It applies to value types (`object`, `data` and boxed primitives). A `service` _cannot ever_ conform to a `trait`.
- A `role` describes a capability, a responsibility. It can be embodied by any type — but typically `service`. Because it is expected to access the environment — a source that cannot be structurally isolated — it may only ever use `SHARED` semantics.

> [!warning]
> Do not conflate Clawr value types with .Net value types. In .Net, a value type is a type that implies value semantics, and the two terms are conflated by structural necessity.
>
> Clawr does not signal value semantics through type declaration keywords, so the two terms serve distinct purposes. Value semantics is chosen individually per variable. A “value type” is a type that is defined by the memory specifically allocated to it. It’s _value_.

A `trait` is a model type. Just like both `object` and `data`, it can apply to variables of _any_ semantics `const`, `mut` and `ref` as needed. It can also be returned as a _uniquely referenced return value_ and assigned semantics by the caller.

Example roles include:

- Manager types (like a `UserAccessManager`)
- Repositories (`FriendsGraph`)
- Message sending capability (`SMSSender`, `EmailService`…)
- The _Strategy_ pattern

> [!note]
>
> **Do not mistake `role` for the GoF Strategy pattern.**
>
> A `role` is a capability. A `strategy` is an algorithmic variation. But every use of the `strategy` pattern must define a `role` (or a `service` type that can be inherited from).

Example traits include:

- `HasStringRepresentation` (can be converted to a `string`)
- `Arithmetic` (can be used in arithmetics operations)
- `Entity` (has state that can be persisted and reconstituted as raw data)
- `Serializable` (as JSON, YAML…)
- `Hashable`
- `Categorised`

## A `trait` is only Applicable to Value-Types

Clawr redefines the term “value-type.” In C#, a value-type is a type that uses value semantics as opposed to reference semantics. in Clawr, the only types that are restricted to value semantics are unboxed primitives (and the only types restricted to reference semantics are `service`s).

In Clawr’s terminology, a “value type” is a type that describes *values*. A service that exists to execute processes is not a “value,” and types that describe such capabilities are not “value-types.”

A value is a piece of information: a single *datum* or an aggregate of related *data*. This data may be open (`data` types) or encapsulated (`object`). Instances of values may be `SHARED` (use reference semantics) or `ISOLATED` (use copy semantics). To Clawr, even an *Entity* is a value!

A `trait` is only applicable to value-types, while a `role` applies (primarily) to `service`s. You could say that a value-type is any type that can conform to a `trait`. Or you could say that “a value-type is any type that is not a `service`” (the only types *not* able to conform to `trait`s).

Another perspective is that an `object` is a “value-type” because its methods are restricted to touch its fields only (its own data). It may not reach beyond to access sensors, the internet, the file system… To access the environment, you need a `service`.

<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../scripts/admonitions.js"></script>
<link rel="stylesheet" href="../../scripts/admonitions.css">
