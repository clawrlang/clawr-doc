&nbsp; / &nbsp; [The Clawr Language](../README.md)

# Refactorings

> [!note]
>
> This is a discussion on refactoring as a general concept.
> [Look here](../../../guides/theory/refactorings.md) for a theoretical perspective on refactorings.

Clawr is designed for expressivity. Choosing a specific design communicates intent clearly and allows developers to reason about the code more effectively. There might, however, be situations where the initial design can be improved. Refactorings provide a systematic way to make these improvements while preserving the intended behavior of the code.

Martin Fowler has extensively discussed refactorings in his book [_Refactoring: Improving the Design of Existing Code_][refactoring-book]. In that book, he describes recipes for a variety of common refactorings and how to apply them effectively. Most of those refactorings can be applied verbatim to Clawr as well.

Here is a list of refactoring recipes specific to Clawr:

- [Encapsulate Data](./encapsulate-data.md) — converting an exposed `data` structure into an `object`.

[refactoring-book]: https://martinfowler.com/books/refactoring.html
