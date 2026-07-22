<!-- markdownlint-disable MD041 MD033 -->
<img src="/images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Traits and Roles

> _What is the difference between a `trait` and a `role`? They both seem to do the same thing. Aren’t they both interfaces?_
> — Frequently asked question

Technically, syntactically, and maybe even semantically, traits and roles are indeed the same thing. The runtime implementation is actually identical.

The difference is conceptual. A `trait` hides irrelevant data and emphasises essential information; a `role` signals a capability.

- `role` applies to `service` types.
- `trait` applies to `data` and `object` types.
  Because a `service` is a tool that does not apply copy-on-write, it must always be referenced by `ref` variables, `ref` parameters and `ref` return values. And because a `role` an only apply to `service` entities, the same rule applies to it.

A `trait` is a model type. Just like both `object` and `data`, it can apply to variables of _any_ semantics `const`, `mut` and `ref` as needed. It can also be returned as a _uniquely referenced return value_ and assigned semantics by the caller.

Example roles include:

- Manager types (like a `UserAccessManager`)
- Repositories (`FriendsGraph`)
- Message sending capability (`SMSSender`, `EmailService`…)
- Strategy pattern
  > Actually… a `role` _is_ maybe a _Strategy_ by definition. Maybe the keyword should be `strategy` instead of `role`?

No. a `role` is a capability. A `strategy` is an algorithmic variation. A `FriendsGraph` is not a strategy.

Example traits include:

- `StringRepresentable` (can be “`toString()`-ed”)
- `Arithmetic` (can be used in arithmetics operations)
- `Entity` (has state that can be persisted and reconstituted as data)
- `Serializable` (as JSON, YAML…)
- `Hashable`
- `Categorised`
