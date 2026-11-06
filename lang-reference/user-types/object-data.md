&nbsp; / &nbsp; [The Clawr Language](../README.md) &nbsp; / &nbsp; [User-Defined Types](./README.md)

# User-Defined Type Constraints `object` vs `data`

Clawr does not attribute value semantics vs reference semantics to _types_ like many other languages do. Instead, it enforces such semantics on a _per-variable_ basis.

> [!note]
>
> If you are used to the term “value type” from other languages like C#, you’ll find that the term is used differently in this documentation. In C#, a “value type” is a type that copies its value when assigned or passed around. In Clawr terminology, a “value type” is a type that contains all its state information (its “value”) in its primary data location, its allocated memory. This is in contrast to a [`service`](./service.md), which reads and manipulates resources throughout the runtime environment as part of its extended state.

Because Clawr does not need types to carry inherent value or reference semantics, it does not define `struct` or `class` types at all. Instead, the main user-defined types use the keywords `object` and `data`. The former implies encapsulation and controlled interaction, while the latter implies direct access to its stored data elements. The distinction mirrors the difference between objects and data structures as described by “Uncle Bob” Martin:

> [!quote]
>
> - An Object is a set of functions that operate upon implied data elements.
> - A Data Structure is a set of data elements operated upon by implied functions.
>
> — Robert C. Martin (“Uncle Bob”), [_Classes vs. Data Structures_][ub]

Uncle Bob unfortunaely uses the term “class” in the title of his piece, which can be misleading for readers who do not understand that classes can be used to implement both objects and data structures.

## Why Objects are Preferred over Data Structures

The medical condition of anaemia refers to having a deficiency of red blood cells, which means that the blood cannot carry enough oxygen to bodily tissues. The lack of oxygen leads to fatigue, weakness, and other health issues. In Domain-Driven Design (DDD), the term "anaemic" is used for models that expose their data for direct manipulation, scattering the procedural code that manipulates it throughout the code base. The terminology is apt because such models resemble the medical condition: they lack a certain “vitality” or robustness, as their state is not self-sustaining and relies heavily on external validation and manipulation to ensure correctness and to avoid inconsistencies.

A "rich model," in contrast, uses encapsulation to ensure that its state remains valid and consistent _after every single operation_. By embedding the business rules within the model itself, the need for external validation is eliminated, and the model can evolve without breaking its internal logic. This approach also clarifies the application's intent and the goals of its users, as the system models “what happens” during business processes rather than merely storing the requisite data.

Encapsulation offers another advantage too: loose coupling. Loose coupling reduces dependencies between components, allowing changes in one part of the system to have minimal impact on other parts. By hiding the internal state of an object and the algorithms that operate on it, instead exposing only the methods that interact with it, you not only protect the application state from invalid manipulation and corruption. You also decouple the implementation details from the rest of the system, making it easier to modify or replace components without affecting other parts of the application.

At the end of his article, Uncle Bob restates the distinction between classes (objects) and data structures as follows:

> [!quote]
>
> - Classes make functions visible while keeping data implied.
> - Data structures make data visible while keeping functions implied.
> - Classes make it easy to add types but hard to add functions. Data structures make it easy to add functions but hard to add types.
>
> — Robert C. Martin (“Uncle Bob”), [_Classes vs. Data Structures_][ub]

[ub]: https://blog.cleancoder.com/uncle-bob/2019/06/16/ObjectsAndDataStructures.html

### Why You Sometimes Need Data Structures

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

## Data Structure Syntax In Clawr

Clawr borrows Uncle Bob’s terminology in the keywords `object` and `data`. A `data` type defines structure for direct interaction with data elements.

```clawr
// “A Data Structure is a set of data elements operated upon by implied functions.”

data LogInfo {
  position: { latitude: real, longitude: real }
  velocity: { heading: real, speed: real }
}
```

A `data` type is instantiated directly using a data literal, and its fields are accessed without any encapsulation or method calls. This makes `data` types ideal for scenarios where you need straightforward access to structured information.

```clawr
@main {
  const routeData: [LogInfo] = [
    {
        position: {latitude: 10.1, longitude: 12.2},
        velocity: {heading: 120.0, speed: 98.5}
    }, ...
  ]

  print(routeData[0].position.latitude)
  print(routeData[0].velocity.speed)
}
```

## Object Syntax In Clawr

An `object` is a _meaningful_ entity that hides a `data` structure in its bowels. The `object` exposes interaction points (methods) that hide the specific implementation from dependent code.

```clawr
// “An Object is a set of functions that operate upon implied data elements.”

object Money {
    func dollars() => self.cents / 100
    func cents() => self.cents % 100

init:
    func cents(_ c: integer) -> Money => { cents: c }
    func dollars(_ d: integer, cents: integer (0..<100) = 0) => {
        cents: d * 100 + cents
    }
    func amount(_ a: real) => {
        cents: integer(Math.round(a * 100))
    }

state:
    const cents: integer
}

// A companion namespace defines “static” members and methods.

namespace Money {
    const zero = { Money.cents(0) }
}
```

### Object Sections

An `object` in Clawr is divided into distinct sections that define its behavior and state. The main sections are:

- the implicit read-only methods section — Defines methods that provide read-only access to the object's state.
- `mutating:` — Defines methods that modify the object's state. Calling any of these triggers copy-on-write semantics for isolated variables.
- `init:` — Defines initializers for calling in data literals.
- `state:` — Declares the internal state of the object. The state is always private and can only be accessed or modified through the object's own methods.

The read-only methods section is implicit and needs to be defined first, before the `state:` section (as well as all the others). This is intentional, as the `object` should be defined by your interactions with it, rather than how it stores its state.
