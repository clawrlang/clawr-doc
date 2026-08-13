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

> [!question]
> Actually… a `role` _is_ maybe a _Strategy_ by definition. Maybe the keyword should be `strategy` instead of `role`?
>
> No. a `role` is a capability. A `strategy` is an algorithmic variation. A `FriendsGraph` is not a strategy. But every use of the `strategy` pattern must define a `role` (or an abstract`service`).

Example traits include:

- `HasStringRepresentation` (can be converted to a `string`)
- `Arithmetic` (can be used in arithmetics operations)
- `Entity` (has state that can be persisted and reconstituted as raw data)
- `Serializable` (as JSON, YAML…)
- `Hashable`
- `Categorised`
