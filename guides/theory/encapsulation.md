&nbsp; / &nbsp; [Theory](./README.md)

# What is Encapsulation?

> [!note]
>
> This is a discussion on encapsulation as a general concept.
> [Look here](../../spec/language/user-types/object-data.md) for a Clawr perspective on objects and data structures.

Encapsulation is two things in one word. On the one hand, it is a mechanism for protecting an entity's internal state from invalid manipulation. On the other hand, it is a design principle that promotes modularity and maintainability by decoupling structural details from their usage context.

“Uncle Bob” Martin, a prominent software engineer and author, has written extensively on software design principles, including the distinction between encapsulated “objects” and “data structures,” and the trade-offs involved in using each approach.

> [!quote]
>
> - \[Objects\] make functions visible while keeping data implied.
> - Data structures make data visible while keeping functions implied.
> - \[Objects\] make it easy to add types but hard to add functions.
>   Data structures make it easy to add functions but hard to add types.
> - Data Structures expose callers to recompilation and redeployment.
>   \[Objects\] isolate callers from recompilation and redeployment.
>
> — Robert C. Martin (“Uncle Bob”), [_Classes vs. Data Structures_][ub]

[ub]: https://blog.cleancoder.com/uncle-bob/2019/06/16/ObjectsAndDataStructures.html

Uncle Bob unfortunately uses the term “class” in his piece, which can be misleading for readers who do not understand that languages like Java can very easily create data structures using `class` types. The quote above has replaced the word “Classes” with “Objects” for clarity.

## Why Objects are Preferred over Data Structures

Encapsulation is usually preferred over exposing raw data structures because it provides a controlled interface for interacting with an entity's state, ensuring that its invariants are maintained and that its internal representation can evolve without breaking external code.

### Protection of Invariants

Encapsulation helps protect an entity's invariants — the conditions that must always hold true for its internal state. By restricting direct access to internal properties and exposing controlled interfaces, an entity can ensure that its state remains consistent and valid. This prevents external code from inadvertently violating the entity's rules, leading to more reliable and predictable behavior.

### Decoupling from Implementation Details

Encapsulation also promotes modularity and maintainability. By hiding the internal implementation details and exposing only the necessary interface, changes to the internal structure of an entity do not affect the code that depends on it. This decoupling allows developers to modify, extend, or optimize the internal workings of an entity without introducing unintended side effects, resulting in a more flexible and maintainable codebase.

### Self-Documenting Code

Encapsulation encourages self-documenting code by making the responsibilities and behavior of an entity explicit through its interface. There is an oft touted principle in software design: “Don't model state, model behavior.” When you model behavior, you communicate intent rather than technical details. This makes the code easier to understand and to modify correctly as the purpose of the entity remains clear and explicit.

When programming to technical details, the purpose of the code can become obscured, as the focus shifts from what the entity represents and does to how it stores and manages its data. This can lead to incorrect behavior that remains undetected while causing inconsistencies in the system. These inconsistencies may propagate and compound before they are detected, making recovery all but impossible

When an object's methods clearly express the operations that can be performed on it, and its internal state is hidden, programmers will hopefully reason about the object as a single unit rather than a set of technical or structural details. Consumers of the object do not need to know how the object is implemented; they only need to understand the interface, which serves as a form of documentation that is always in sync with the code.

## Domain-Driven Design and the Anaemic Model

The medical condition of anaemia refers to having a deficiency of red blood cells, which means that the blood cannot carry enough oxygen to bodily tissues. The lack of oxygen leads to fatigue, weakness, and other health issues. In Domain-Driven Design (DDD), the term "anaemic" is used for models that expose their data for direct manipulation, scattering the procedural code that manipulates it throughout the code base. The terminology is apt because such models resemble the medical condition: they lack a certain “vitality” or robustness, as their state is not self-sustaining and relies heavily on external validation and manipulation to ensure correctness and to avoid inconsistencies.

A "rich model," in contrast, uses encapsulation to ensure that its state remains valid and consistent _after every single operation_. By embedding the business rules within the model itself, the need for external validation is eliminated, and the model can evolve without breaking its internal logic. This approach also clarifies the application's intent and the goals of its users, as the system models “what happens” during business processes rather than merely storing the requisite data.

Encapsulation offers another advantage too: loose coupling. Loose coupling reduces dependencies between components, allowing changes in one part of the system to have minimal impact on other parts. By hiding the internal state of an object and the algorithms that operate on it, instead exposing only the methods that interact with it, you not only protect the application state from invalid manipulation and corruption. You also decouple the implementation details from the rest of the system, making it easier to modify or replace components without affecting other parts of the application.

At the end of his article, Uncle Bob restates the distinction between classes (objects) and data structures as follows:

## Why You Sometimes Need Data Structures

While objects provide encapsulation and protect the integrity of their internal state, there are scenarios where exposing raw data is beneficial. Data structures are particularly useful for transferring information between different parts of a system, for serialization, or for interfacing with external systems where the internal logic of an object is irrelevant. They allow for straightforward access and manipulation of data without the overhead of method calls or encapsulation constraints.

Choose an encapsulated object when…

- You want to enforce invariants and control how the state of the system evolves.
- You want to hide implementation details and provide a clear interface for consumers.
- You gather data and perform tasks based on input that may be invalid (e.g. coming from a user).
- You are constructing the “command” part (a.k.a. “write model”) of a CQRS architecture.

Choose an exposed data structure when…

- You need to make computations directly on read-only data you do not control.
- You need to search or filter through large collections of “big data.”
- You are defining a protocol for communication between different subsystems or external systems.
- You are persisting structured data for later retrieval or processing.
- You are constructing the “query” part (a.k.a. “read model”) of a CQRS architecture.
