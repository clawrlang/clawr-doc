# Function Parameters

Function parameters have the [same semantics](./variable-semantics.md) as ordinary variables and properties. Plus a fifth mode that allows values of any semantic flavour to be passed.

A `const` or `mut` parameter can only accept `ISOLATED` arguments. The `const` keyword means that the variable is immutable in the function body, while `mut` allows a copy of the argument to be modified in isolation.

A `ref` or `mutref` parameter accepts only `SHARED` values. It may modify the entity with impunity and no copy is made. The `mutref` variant allows the in-body variable to be reassigned if necessary. It is not recommended to use this form as it is almost never needed.

## The `(default)` Semantic Mode

Requiring overloads for different semantic modes (`ISOLATED` vs `SHARED`) can get awkward. For that reason, there is a fifth parameter variation that is expected to be used frequently. Because of this expectation, the mode is selected by omitting any semantic keyword.

Omitting the semantic keyword creates a read-only parameter that may be passed values of either kind. The limitation is that the in-body variable may not be mutated (as it is not known if that should trigger copy-on-write), and it may not be directly assigned to any variable or sent as a parameter where a specific semantics is required.

A `(default)` parameter `MUST NOT` be assigned to another variable or property, because there is no static way to ensure that the assignment preserves isolation. It `MUST NOT` be mutated either: modifying it without first copying is unsafe, and applying copy-on-write to a `SHARED` instance is also fraught. A function that needs to store the value `MUST` copy it ([Automatic Reference Counting](../../cir/arc.md#parameters)).

It may however be passed as an argument to a function where the matching parameter has the same semantic leeway, for example the `copy(of:)` function.

## Conformance and Mutability

In a `trait` or `role`, parameters should be declared as `const` or `ref` (assuming immutability), not `mut` or `mutref`. Mutability is irrelevant to the caller as mutation does not propagate outside the function body. Implementers still have the choice to conform using the corresponding mutable keyword as needed:

```clawr
trait SomeTrait {
  func foo(const label varName: Type)
}

object SomeObject: SomeTrait {
  // This works as implementation of the trait requirement
  func foo(mut label varName: Type) {
    varName.modify()
    // ...
  }
}

object IncorrectObject: SomeTrait {
  // This does not match the trait requirement (wrong semantics)
  func foo(ref label varName: Type) {
    varName.modify()
    // ...
  }
}
```

## Labels and Ordering

- All labeled parameters `MUST` appear after all unlabeled parameters in a declaration.
- Arguments in a call `MUST` be given in the same order as the parameters: unlabeled arguments first, then labeled arguments in declaration order. Currying (below) is the exception.
- The canonical name of a function includes its parameter labels. `copy(to:)` and `copy(of:)` are different functions and `MUST NOT` conflict, even if declared in the same module or namespace.
- Two functions with the same base name and the same labels, differing only in label order, have the same signature. Declaring both `MUST` be a compile-time error.

> [!warning]
> [ADR-013](../../../adr/adr-013.md) says that labeled arguments “can appear in any order”, which contradicts the ordering rule above ([ADR-012](../../../adr/adr-012.md)). Declaration order is specified here until the author decides which rule is intended.

## Currying

Currying is by label, not by position. A labeled parameter can be bound ahead of time, producing a new function that takes the remaining parameters. The syntax is not final.

```clawr
curry rotateUp = rotate(by: true)
curry rotateDown = rotate(by: false)

const a = rotateUp(false) // ambiguous
const b = rotateUp(ambiguous) // true
const c = rotateUp(true) // false
```

- Only labeled parameters can be curried.
- A curried function preserves the defaults and optionality of the parameters that were not bound.
- Currying is resolved by the frontend. The CIR `MUST` contain only the uncurried equivalent, for example `rotate(false, by: true)`.

The rationale is documented in [ADR-012](../../../adr/adr-012.md) and [ADR-013](../../../adr/adr-013.md).