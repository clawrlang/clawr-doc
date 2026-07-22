<!-- markdownlint-disable MD041 MD033 -->
<img src="/images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# User-Defined Types

There are several classes of user-defined types:

- A [`data` structure](./object-data.md) is a simple aggregate of related information.
- An [`object`](./object-data.md) is an encapsulated (hidden or “private”) `data` structure with behaviour-first design.
- A [`trait`](./trait-role.md) is an an abstract interface that may be implemented by `data` oriented types.
- A [`service`](./service.md) is an object whose state is defined by the system, not (or not primarily) by a `data` structure.
- A [`role`](./trait-role.md) is a capability that a `service` may embody.
- An `enum` is a list of available values a type allows.
- A `union` type can have values that are structured in multiple ways.
