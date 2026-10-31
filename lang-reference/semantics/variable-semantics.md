# Variable Scope & Semantics

> What if you want to use the same type in different parts of your code, but sometimes you need it to be a `struct` and at other times a `class`?

This is the thought that sparked the desire to design a new programming language.

> [!note]
>
> This document gives a practical explanation of how variables work in Clawr. If you want an introduction to the conceptual meaning of the keywords, you should check out the [Mental Model](./README.md). Or you could read that first and then come back here.

In the languages I know, such a need would require duplicating code — which violates DRY — or wrapping one type inside another — a `class` that contains a `struct` — which can be awkward.

In Clawr, I want to be able to define a type once and then specify its "kind" (i.e., `struct`-like vs `class`-like) based on the context in which it is used. This would allow for more flexible and reusable code without duplication.

“What is the difference between a `struct` and a `class`,” you ask? The difference is that of isolation versus sharing.

In programming we have a big problem called _shared mutable state_.

## The Problem: Shared Mutable State

Shared mutable state occurs when multiple parts of a program can access and modify the same data. This can lead to unexpected behaviour and bugs, it makes reasoning about code more difficult, and it adds complex synchronisation requirements in parallel execution.

It is caused by assigning one variable to another (`x = y`). Here are some concrete situations that can lead to shared mutable state:

- A variable is assigned to a property of an object or data structure
- A variable is passed as an argument to a function
- A property is returned from a function
- Multiple threads are started with access to the same variable
- A variable is captured in a closure
- A variable is stored in a global context
- A variable is stored in a collection that is shared across different parts of the program
- etc

### How Languages Address This

Different programming languages take different approaches:

- **Functional languages** (Haskell, Clojure): Disallow mutation altogether
- **Modern system languages** (Rust): Use ownership and borrowing systems
- **Hybrid languages** (C#, Swift): Introduce types with isolated mutation
  - `struct`: Value semantics (copied, isolated)
  - `class`: Reference semantics (shared, mutable state)
    The problem with the hybrid approach: **You must decide at type definition whether it will be a struct or class**, limiting reusability.

The problem with ownership and borrowing is that it can be confusing. While Rust's ownership system prevents entire classes of bugs, it comes at a cost: programmers must explicitly manage lifetimes and borrowing relationships through complex syntax. This shifts cognitive effort from domain problems to memory management details, making the code's intent less immediately clear.

## Clawr’s Paradigm

Here is a proposal for Clawr. Instead of defining semantics per type, let’s make each variable individually declare its isolation level.

Languages like Rust use ownership and borrowing to manage memory safety. While this is powerful, it requires explicit lifetime annotations that add syntactic overhead. With the proposed strategy, we can provide similar safety guarantees with clearer, more readable code.

| Keyword               | Semantic Meaning                                                                       |
| --------------------- | -------------------------------------------------------------------------------------- |
| `cow T` (or just `T`) | Isolated Value — copied on write, no other variable can observe or cause changes to it |
| `ref T`               | Shared Mutable State — multiple variables can reference and modify this entity         |
| `const`               | Immutable Variable — cannot be modified after initialization                           |
| `mut`                 | Mutable Variable — can be modified after initialization                                |

“Immutable” means different things for `ref T` variables than `cow T`variables. A `const cow T` variable is structurally immutable; the value cannot change in any way. A shared entity, however is always mutable, so a `const ref` variable is only immutable in the sense that it cannot be reassigned different entity.

> [!tip]
>
> Check out the [Mental Model](./README.md) for a different perspective.

| Mutability \ Isolation | `cow`                            | `ref`                                              |
| ---------------------- | -------------------------------- | -------------------------------------------------- |
| `const`                | Constant, structurally immutable | Cannot be reassigned, referenced entity is mutable |
| `mut`                  | Isolated mutable state           | Shared mutable state                               |

### Isolated and Shared Cannot Mix

An isolated (`cow`) variable must never refer to a shared entity, and a reference variable must never refer to an isolated value. If they did, the isolation semantics could not be guaranteed. Therefore, every assignment of a value from one isolation mode to a variable of another requires explicit copying using the `copy(of:)` function.

```clawr
const x: ref T = ...
const y: T = copy(of: x) // declares y as an isolated variable
const z = copy(of: x) as cow // declares z as an isolated variable (inferring type)
```

## Example: Bowling

Let's explore an example to see why this flexibility is powerful. Consider a bowling game score calculator that needs to track rolls:

```clawr
subset RollResult = integer(0...10)

object BowlingGame {

    score() -> integer(0...300) {
        // Calculate total score
        // See the Bowling Game Kata (http://www.butunclebob.com/ArticleS.UncleBob.TheBowlingGameKata) for an example algorithm.
    }

mutating:
    func roll(droppingPins count: RollResult) {
        rolls.append(count)
    }

init:
    func start() => { rolls: [] }

state:
    rolls: [RollResult]
}
```

> [!note]
>
> This `BowlingGame` type is defined as an `object`, meaning it hides its data structure behind an encapsulation. This will be discussed in a [different document](../user-types/object-data.md).

Now, when using `BowlingGame`, we can choose the appropriate semantics based on our needs:

### Copy Semantics with `cow`

When using `cow` variables, changes are isolated:

```clawr
mut game1 = { BowlingGame.start() }  // A cow variable
game1.roll(droppingPins: 9)
print(game1.score) // 9

mut game2 = game1                    // Shares memory (temporarily)
game2.roll(droppingPins: 1)          // Triggers copy-on-write
print(game2.score) // 10 -> includes second roll
print(game1.score) // 9 -> unchanged by second roll (isolated variable)
```

### What happened?

1. `game1` and `game2` initially reference the same memory
2. When `game2.roll(droppingPins:)` is called (a mutating method), the runtime detects that multiple references exist
3. A copy is made before modification, ensuring `game1` remains unchanged
4. Each variable has its own independent game state

### Reference Semantics with `ref`

When using `ref` entities, changes are shared:

```clawr
const game1 = { BowlingGame.start() } as ref // Explicitly as ref
game1.roll(droppingPins: 9)
print(game1.score) // 9

const game2 = game1                    // Shares the same game
game2.roll(droppingPins: 1)            // Modifies shared state
print(game2.score) // 10 -> includes second roll
print(game1.score) // 10 -> changed too! (two variables, but only one game)
```

<!-- markdownlint-disable MD024 -->

### What happened?

1. Both variables reference the same game entity
2. Modifications through either variable affect the shared state
3. No copying occurs — this is true reference semantics

### When to Use Each

The default is `cow`. It is usually the right choice. But sometimes sharing is _the point_.

- When creating a manager for accessing a database, a sensor or other feature of the environment.
- When implementing the Singleton pattern.
- When circular references are needed.
