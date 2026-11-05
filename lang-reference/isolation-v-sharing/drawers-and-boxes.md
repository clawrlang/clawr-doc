&nbsp; / &nbsp;[The Clawr Language](../README.md) &nbsp; / &nbsp;[Isolation vs Sharing](./README.md)

# Drawers and Boxes

**_A mental model for understanding isolation and sharing in Clawr._**

Value semantics and reference semantics are fundamental tools for understanding imperative programs. In traditional languages, this distinction is determined per type. In Clawr, the choice is done over and over again for each variable declaration. The `ref` keyword modifies the variable's type to distinguish between isolated and shared data. An isolated `const` variable is guaranteed to never change in any respect. A `mut` dito may be modified, but never indirectly. But a `ref` variable is a pointer to shared data — potentially over multiple threads — which can change surprisingly from one code statement to the next.

| Declaration      | C Equivalent      | Semantics                                                                       |
| ---------------- | ----------------- | ------------------------------------------------------------------------------- |
| `const x: T`     | `const T` (stack) | Constant value of type `T`, structurally immutable                              |
| `mut x: T`       | `T` (stack)       | Isolated mutable value of type `T`                                              |
| `const x: ref T` | `T* const` (heap) | Shared mutable entity of type `T`, cannot be reassigned                         |
| `mut x: ref T`   | `T*` (heap)       | Shared mutable entity, can be reassigned to a different entity of the same type |

But just mapping keywords to terms like “isolated” and “shared” might not be enough to understand how they truly work. What does it _mean_ that a variable is isolated? A mental model — a vivid metaphor — might be a better didactic tool.

## The Traditional OOP Mental Model

In traditional object-oriented languages (Java, JavaScript, Python, C++, etc.), we're taught to think of “objects” as blocks of memory “on the heap,” and variables as pointers to those blocks. Multiple variables can store the same memory address and therefore reference the same object. When the object is updated through any variable, all other variables see the change immediately, because it is the _object_ that changes, not “the variable” itself.

A problem with this model (seen especially in languages like Java, JavaScript, and Python) is that it encourages shared mutable state. Multiple variables can reference the same object, and changes through one variable are immediately visible through others. This can lead to concurrency bugs and makes reasoning about program behavior more difficult.

If, instead, we think of the variable _itself_ as the object, it becomes an isolated entity that contains its own data. Changes to a variable cannot affect any other variable if there is no shared reference. Languages like Swift and C# have introduced the idea of “value semantics” (or “value types” in C#) to give programmers more control over how data is shared and mutated. A value semantics type is copied in its entirety when assigned to a new variable or passed to a function (or before the first subsequent modification to it), ensuring that changes to one variable do not affect others. Such variable can be considered as _being_ the object itself, rather than merely a reference to it.

> [!warning] Overloaded Terminology
>
> Clawr may want to use the term “value type” in a different way from Swift and C#. A Clawr value type is a definition that may be shared in either shared or isolated contexts. It is a “value type” in the sense that its state is defined only by the contents of its own memory, it cannot reference the runtime environment. (See the discussion on [`object` vs `data`](../user-types/object-data.md) compared with [`service`](../user-types/service.md) for more details.)
>
> This documentation will endeavor to use terms like “value semantics” or “isolation” to refer to the concept that C# calls “value types”, to avoid confusion with Clawr’s own terminology.

### Stack vs Heap

A C# `struct` is stack allocated, while a `class` is heap allocated. The stack was invented in very early programming languages [^algol], to provide a simple and efficient way to manage function call frames and local variables, with automatic memory reclamation when variables “go out of scope.”

[^algol]: ALGOL 60 is often credited with formalising the notion of a "block-structured" language with nested scopes that map naturally onto a stack.

A stack variable is allocated a fixed slot in the stack frame of the function that declares it. Its lifetime is tied to the function call, and its memory is automatically reclaimed when the function returns. This ensures that stack variables are isolated from each other, as each has its own dedicated memory region. A heap variable, on the other hand, stores only the address of the actual data (sometimes referred to as a “pointer”). The actual data resides on the heap and can be referenced by multiple variables, making it inherently shared and prone to aliasing bugs.

Unfortunately, stack variables can be also passed by reference and referenced by a pointer, which can break the isolation guarantees if not handled carefully, as the pointer can outlive the stack frame and introduce unintended sharing.

This mental model is a direct reflection of the implementation. The problem is that the implementation cannot change. We cannot improve on the implementation if the only model we have is _the implementation itself_. A model should not be tied to implementation details such as whether data is allocated on the stack or on the heap. Instead, it should capture the conceptual distinction between isolated and shared entities, allowing us to reason about program behavior without being constrained by low-level memory management concerns.

The more modern language _Swift_ has a similar distinction between `struct` and `class`, though it does not enforce stack allocation for `struct` types. Nevertheless, their behavior is consistent with stack allocation semantics (and C# was probably a big influence in the design). Thanks to a new framing of `struct` as value semantics and `class` as reference semantics, Swift was able to change the implementation. Instead of stack-allocating `struct` instances, they can now be heap allocated if necessary, but use copy-on-write to maintain value semantics.

Clawr builds on Swift’s insights and is designed to allow stack-allocation or a heap-allocated copy-on-write implementation, depending on the skills and capabilities, and the strategies and requirements, of the compiler development team. The model focuses on the conceptual distinction between isolation and sharing, rather than the low-level details of memory management.

### A Better Mental Model: Drawers and Boxes

All data lives in a container, whether a drawer or a box. While we interact with the container differently depending on its kind, both kinds are the same in that each container stores its own data independently from others. Data can be copied from one container to another, but every container remains a separate entity storing its own version of the information.

A stack variable is like a slot in a dresser or a kitchen unit: it holds a single drawer which cannot be replaced. A heap variable (or pointer) is like a communications hub for operating a drone that interacts with a range of boxes scattered around the floor or on shelves: the drone can be assigned to any given box, and multiple drones can interact simultaneously with the same one.

When copying a heap variable, you merely send another drone to the same box. Both variables now reference the same data. When copying a stack variable, the target variable cannot ”become” the same slot, so the only thing you can do is copy the _contents_ of the original drawer into the target.

The metaphor is summarised in this table:

| Classic Location | Variable                 | Value                                 | Assignment Action                                          |
| ---------------- | ------------------------ | ------------------------------------- | ---------------------------------------------------------- |
| **Stack**        | Slot with a fixed drawer | Drawer's contents                     | Fill the contents of the drawer by copying a value into it |
| **Heap**         | Comms hub of a drone     | A box at the drone’s current location | Relocate the drone onto the indicated box                  |

## Clawr Variables and the Drawer-and-Box Metaphor

While older languages like C and C++ allow stack-allocated variables to be passed by reference, Clawr enforces stricter isolation rules, preventing isolated variables from being aliased by shared-reference variables. A drone may not be assigned to a drawer; it can only interact with boxes.

And while Swift and C# distinguish between value and reference types, Clawr takes the concept further by making isolation configurable _per variable_.

### Types in the Drawers-and-Boxes Metaphor

Unlike C# and Swift — which distinguish between value and reference types at the _type level_ — Clawr allows isolation to be specified _per variable_. This means that the same type can be used for both isolated and shared variables, with the isolation semantics determined by the variable declaration rather than the type itself.

| Declaration      | Metaphor                                              |
| ---------------- | ----------------------------------------------------- |
| `const x: T`     | A drawer whose content cannot change                  |
| `mut x: T`       | A drawer whose contents can be replaced or modified   |
| `const x: ref T` | The hub of a drone dedicated (bolted) to a single box |
| `mut x: ref T`   | The hub of a drone that may visit different boxes     |

> [!note] Overloaded Term
>
> The term “type” is overloaded. On the one hand it refers to the shape and behavior of a value, describing what operations can be performed on it and/or what data elements it stores. On the other hand, the type of a variable is incomplete without also specifying whether it is a drawer (`cow T` or just `T`) or a drone hub (`ref T`), which determines its isolation semantics.

The type of a drawer or box can be seen as the container's general shape, describing what kind of contents it can hold and what operations can be performed on it. A `Credentials` type might contain a username and password, for example, and the drawer or box would be shaped such that it can hold those two properties, but nothing else. A `MailSender` type box could be seen as a closed container with buttons and levers used for sending emails, but not dictating _how_ those emails are sent.

## Clawr Type Categories

### Concrete Types: `data`, `object` and `service`

As Clawr does not need the `struct` vs `class` distinction found in languages like C# or Swift, it instead uses `data`, `object`, and `service` to categorize types based on their intended usage. A `data` type stores data elements without defining behavior, an `object` type defines interactions supported by an encapsulated (hidden) data structure, and a `service` type represents capabilities that may interact with the environment. This categorization complements the drawers-and-boxes metaphor, helping to reduce the risk of accidental sharing or an invalid state.

Note that `service` cannot be used as a drawer (`cow T`), while `data` and `object` types can (and are encouraged to be used this way whenever possible). If the `service` interacts with the environment, its state cannot be isolated to one container and declaring it as `cow T` would be dishonest.

These types are all complex structures that each may contain multiple properties, each of which in turn can be either isolated or shared. In other words, a drawer variable can contain a drone hub! And the box assigned to their drone can contain both drawers and more drone hubs… Note that the isolation semantics of the containing structure does not affect the box assigned to a drone. A `ref` property inside a `cow T` variable is still a shared reference, not included in the drawer's isolation guarantee.

If the container is a `const` drawer, its contents cannot be modified (even properties that have been declared as mutable). That includes the target of any drone whose hub it contains, but not the box itself. The drone is bolted to a specific box, but there are no constraints on the mutability of that box other than what has been individually declared for each of its properties.

### Abstract Types: `trait` and `role`

In Clawr, traits and roles help define the capabilities and responsibilities of different types and variables. A `trait` defines the constitution of a value (e.g. a `data` or `object` structure, but not a `service`), such as whether it can be compared with others of its kind, used as a hash key in search algorithms, or printed by a string. A `role`, instead, specifies the required capabilities of a box, which may interact with the environment (meaning that it can be a `service`). A `MailSender` role, for example, would require the box to have the capability to send emails.

A `role` variable must always be a drone hub (`ref T`), never a drawer (`cow T`); if the agent represented by the role can interact with the environment, its state cannot be isolated to one container. A `trait` variable, on the other hand, can be either a drawer or a drone hub, depending on the desired isolation semantics.

## The Container Kind (Drawer or Drone Hub) is Part of the Variable Type

In Clawr, the type of a variable is not complete without considering its isolation semantics. A `cow T` variable is incompatible with a `ref T` variable (even with the same `T`). The former guarantees isolation while the latter allows shared access; if they are mixed, it could lead to violations of the intended isolation guarantees.

This principle reinforces the idea that isolation is a property of the variable declaration rather than the type itself, ensuring that developers must explicitly choose the appropriate isolation level for each variable to maintain the integrity of the program's memory model.

By making isolation an explicit part of the variable type, Clawr prevents accidental sharing of isolated data and enforces clear boundaries between isolated and shared values, which is crucial for maintaining predictable and safe memory behavior.

## Summary

In summary, Clawr's type system combines the shape and behavior of values with the isolation semantics of drawers and drone hubs. By categorizing types into `data`, `object`, and `service`, and by distinguishing between traits and roles, Clawr provides a clear framework for managing both the structure and the capabilities of values while maintaining proper isolation and reducing the risk of unintended sharing.

Understanding these distinctions is crucial for writing safe and maintainable Clawr code, as it allows developers to reason about how values are stored, accessed, and shared across different parts of a program.

By carefully considering the type categories, traits, roles, and the choice between drawers and drone hubs, developers can write Clawr code that is both safe and maintainable, ensuring proper isolation and controlled sharing of values throughout the program.
