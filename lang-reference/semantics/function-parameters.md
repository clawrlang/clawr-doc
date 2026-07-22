<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Function Parameters

Function parameters have the [same semantics](./variable-semantics.md) as ordinary variables and fields. Plus a fifth mode that allows values of any semantic flavour to be passed.

A `const` or `mut` parameter can only accept `ISOLATED` arguments. The `const` keyword means that the variable is immutable in the function body, while `mut` allows a copy of the argument to be modified in isolation.

A `ref` or `mutref` parameter accepts only `SHARED` values. It may modify the entity with impunity and no copy is made. The `mutref` variant allows the in-body variable to be reassigned if necessary. It is not recommended to use this form as it is almost never needed.

## The `(default)` Semantic Mode

Requiring overloads for different semantic modes (`ISOLATED` vs `SHARED`) can get awkward. For that reason, there is a fifth parameter variation that is expected to be used frequently. Because of this expectation, the mode is selected by omitting any semantic keyword.

Omitting the semantic keyword creates a read-only parameter that may be passed values of either kind. The limitation is that the in-body variable may not be mutated (as it is not known if that should trigger copy-on-write), and it may not be directly assigned to any variable or sent as a parameter where a specific semantics is required.

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
