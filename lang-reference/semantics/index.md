<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Clawr Variable Semantics

Value semantics and reference semantics are fundamental tools for understanding imperative programs. In Clawr, this choice is part of each variable declaration. The `const`, `mut`, `ref` and `mutref` keywords determine how the variable interacts with other variables. A `const` variable may never change in any respect, a `mut` variable may be modified, but only through direct reference, and a `ref`/`mutref` variable is a pointer to shared data — potentially over multiple threads — which can change surprisingly from one code statement to the next.

> [!note]
> This document provides conceptual metaphors for the different kinds of variable declarations in Clawr. If you want a more practical explanation of how variables work, you should consider reading the [Variable Semantics](variable-semantics.md) document. Or you can start here and read that next.

| Keyword  | Semantics                                |
| -------- | ---------------------------------------- |
| `const`  | Constant, structurally immutable         |
| `mut`    | Isolated mutable state                   |
| `ref`    | Shared mutable entity                    |
| `mutref` | Shared mutable entity, can be reassigned |

But just mapping keywords to terms like “isolated” and “shared” might not be enough to understand how they truly work. What does it _mean_ that a `mut` variable is isolated? A mental model — a vivid metaphor — might be a better didactic tool.

## The Traditional OOP Mental Model

In traditional object-oriented languages (Java, JavaScript, Python, C++, etc.), we're taught to think of "objects" as blocks of memory, and variables as pointers to those blocks. Multiple variables can store the same memory address and therefore reference the same object. When the object is updated through any variable, all other variables see the change immediately, because they all store their data in the same place.

This mental model is a direct reflection of the implementation. The problem is that the implementation cannot change. We cannot improve on the implementation if the implementation itself _is_ the model.

Another problem is that the solution forces shared mutable state — at least without special workarounds. Shared mutable state increases complexity and causes bugs. You should avoid it when you can. It is what scared functional programmers into abolishing statefulness altogether, which might be a tad extreme.

## A Better Mental Model: Drawers and Boxes

Function calls have long employed stack-based memory allocation. [^algol] A section of system memory is dedicated to _the stack_, and the rest is called _the heap_.

[^algol]: ALGOL 60 is often credited with formalising the notion of a "block-structured" language with nested scopes that map naturally onto a stack.

### Drawers on the Stack

Starting with ALGOL 60, and in the languages that evolved out of its tradition, [^languages] when a function call is encountered in source code, the compiler and/or runtime allocate memory on the stack to precisely match the total size of the function’s local variables. Each variable is then assigned a fixed area in that stack memory and cannot be moved to another location. They can only copy their contents between each other.

[^languages]: This includes C/C++, Java, Kotlin, C#, Swift, Ruby, Rust and many other imperative languages.

You could say that such a variable is like a drawer in a dresser. If the drawer is big, it can hold a lot of data and you can reach inside it and rearrange or replace its content. If it is tiny you can only hold a single primitive value such as an integer or a pointer.

But each drawer is locked to a dedicated slot in the dresser. You couldn’t possibly place two drawers in the same slot. There is no aliasing; variables are always distinct. Manipulating the contents of one variable can never affect the contents of another.

### Boxes on the Heap

Not all variables contain their data directly. Some may contain only an address to a value, a.k.a. a _pointer_. Pointers are typically used to indicate some memory on _the heap_. The heap allows memory to be allocated on demand, but that memory has to be explicitly freed when no longer in use, or it “leaks.” (The stack on the other hand is deallocated automatically and never leaks.)

You can think of values on the heap as boxes. Unlike a drawer — which has a specific slot — a box might be assembled and placed just about anywhere.

Any single box can be referenced by multiple variables. You could think of these variables as hands reaching out to grab or assemble a box in a random location. The data container is the box, not the hand. The hand might touch any box; it is not limited to specific locations. At any time, you can follow the hand to the box it is currently holding and then look inside it and/or manipulate its contents.

If multiple hands hold onto the same box when its content changes, all those variables are immediately affected by the change. This is what is called shared mutable state.

The metaphors can be summarised in this table:

| Classic Location | Variable                             | Value                                | Assignment Action                                                  |
| ---------------- | ------------------------------------ | ------------------------------------ | ------------------------------------------------------------------ |
| **Stack**        | Drawer, fixed in place               | Drawer contents                      | Copy the contents of another drawer (or fill with a literal value) |
| **Heap**         | Hand/arm reaching anywhere in memory | A box at the hand’s current location | Grab onto a box                                                    |

These metaphors are post hoc constructions, the stack and the heap were not designed with them in mind. But with the metaphors as our guide, we can consider other implementations. Alternative solutions. Swift e.g. uses the heap for all values and copy-on-write to ensure that drawers remain isolated.

## How the Metaphors Apply to Clawr Variables

Clawr is agnostic to hardware and OS. The specific implementation is irrelevant to its semantics. As a result, “drawers” are not necessarily stack allocated, but the metaphor is still valuable. Maybe _even more so_ actually: because Clawr’s interest is in the semantics, not the implementation, the metaphor _is_ essentially the contract.

A `mut` variable employs the drawer metaphor. It is isolated memory that cannot be changed outside the main algorithm that defines it. There can be no problem with concurrency and there will be no surprise mutations.

A `const` variable is like a `mut` drawer, but in this case you can think of it as glassed-in. You can look inside and read the information, but you cannot modify its contents. The value is set at declaration and after that it never changes.

A `ref` variable is a hand. And it may indicate any box, even boxes held by other hands. It may not grab a drawer, however. The drawers have semantic guarantees that would be violated if a hand was allowed to modify them.

A `mut` drawer is supposed to be unchanged unless referenced directly. A hand would be able to make changes violating that constraint. And a `const` drawer is supposed to be immutable! A hand would not know that fact, and could cause the “immutable” value to change.

| Keyword  | Metaphor          | Semantics                                                                              | C Equivalent      |
| -------- | ----------------- | -------------------------------------------------------------------------------------- | ----------------- |
| `const`  | Glassed-in Drawer | Structurally immutable                                                                 | `const T` (stack) |
| `mut`    | Drawer            | Isolated mutable state                                                                 | `T` (stack)       |
| `ref`    | Hand/Box          | Shared mutable state — single, fixed entity                                            | `T* const` (heap) |
| `mutref` | Hand/Box          | Shared mutable state — capable of being reassigned a new entity (grab a different box) | `T*` (heap)       |

> [!note]
>
> **Equivalences in Other Languages**
>
> The `ref` keyword is analogous to `class` types in languages like Java, C# and Swift. They often refer to the box metaphor as “reference semantics.”
>
> The `mut` keyword is analogous to `struct` types in languages like Swift and C#. They use the term “value semantics.” Java does not support isolated mutation at all.
>
> The `const` keyword is analogous to `let` variables with `struct` types in Swift. The best equivalent in C# might be a `readonly struct`. In Java, this could only be implemented using `final` on every single field, making every instance of the type immutable.

## Why This Matters for Domain Logic

This distinction isn't academic—it directly impacts how you solve problems:

**With `const` variables**, you have maximum security. Immutable values can be freely copied, passed around, and shared without much concern.

**With `mut` variables**, you can reason locally. A function that takes a `mut` parameter knows it has exclusive access to that container. No other part of the program can observe or interfere with changes. This makes it near-trivial to maintain invariants and to reason about state transitions.

**With `ref` and `mutref` variables**, you explicitly opt into sharing. When you see `ref` in a signature, you know that modifications may be visible elsewhere. You know that modifications may come from some place you cannot see. It is sometimes necessary to maintain one canonical truth shared by all even as it exposes your code to elevated risk. At least it is made explicit and can be avoided when sharing is not intentional/desired.

In languages where the type determines these semantic rules, you have to perform an extra lookup to understand the behaviour of a variable. Are all fields in that structure `readonly`/`final`? Is the type a `struct` or a `class`? In Clawr, you can just glance at the variable declaration and immediately know what guarantees it promises.

## Caveat: Mixing Semantics

I said before that `const` and `mut` variables cannot be manipulated by other references. This is true as long as the fields of your data structures are not `ref`. The recommendation is to make all fields `const` or `mut` to avoid this scenario, but that might not always be feasible.

Just like a `struct` in languages like C# and Swift can contain fields that have `class` types, Clawr types can contain `ref` fields and still be assigned to `const` or `mut` variables. Mixing semantics complicates the metaphor.

When dealing with `mut` variables, a `ref` field becomes like a hand reaching out from _inside_ the drawer. It can still refer to an entity shared with other variables. That shared entity is not inside the drawer; only the link is. Therefore, it might still be manipulated in unexpected ways from the `mut` variable’s perspective.

> [!TIP]
>
> Prefer `mut` and `const` fields when possible. Fields without explicit semantics default to `mut`.
>
> Neither `mut` nor `const` fields in a `ref` variable can ever cause a problem. The issue only occurs in one direction: when fields are declared `ref`, they always use reference semantics whether the variable they are referenced through is a `ref` or `mut`. It even breaks the `const` promise as a referenced structure can always change.
