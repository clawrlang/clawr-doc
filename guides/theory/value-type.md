&nbsp; / &nbsp; [Theory](./README.md)

# Value Type

The term “value type” is used in this documentation in a way that you might find confusing. Especially if you have experience from languages like C#. C# uses the term in a way that I would say conflates two different concepts; two concepts that are segregated in Clawr code.

Those concepts are **_value semantics_** and **_the shape of values_**.

> [!warning]
>
> Do not mistake Clawr value types with .Net value types. In .Net, a value type is a type that implies value semantics. Clawr value types on the other hand can be referenced as shared entities if/when needed.

A **value** (in this context) is the specific number or string or combination of data that constitute the current state of a **value container**. The state of a container can transform over time, but the value itself is immutable. As soon as the container has changed in the smallest way, it no longer holds the same value.

The value has a shape that is defined by a **type declaration**. The type is not itself a value. The type _describes_ a value. In traditional languages (including C#), the choice of type also implies either value semantics (copy values at assignment) or reference semantics (copy references). And because of this, those languages all conflate the shape description of a value with the rules of value semantics. Both concepts fall into the term “value types.”

Clawr brings a new perspective. Clawr does not signal value semantics through the choice of type, but individually per variable. The type is merely a shape. If “value type” still meant “a type that implies value semantics,” the only value types in Clawr would be unboxed primitives. (The actual truth for Java, isn’t it?)

## But What is a Value in this Context?

The definition of a **value** actually does not change. A value is still the specific data stored by a container. It is still an immutable thing that disappears at mutation, and value semantics is still used to refer to copying values rather than references.

What changes is the term “value **type**.”

Clawr separates types based on modelling intent, not copy semantics. A `data` type is a naked data structure. An `object` is a data structure hidden behind an interface, and a `service` is an `object`-like entity that is not confined to its own private memory.

The `service` does not represent itself alone. It’s not a value, and it isn’t a container for one. A `data` structure (instance) on the other hand _is_ indeed a value, and an `object` is a _container_ of a value (its internal state). Essentially, a “value type” — in Clawr — is anything that is not a `service`.

More formally, a “value type” can be defined as any type whose instances represent pure values (whether referred to as “data” or “state”), rather than processes for reading and writing values stored elsewhere.
