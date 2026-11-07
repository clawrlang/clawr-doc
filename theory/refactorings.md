&nbsp; / &nbsp; [Theory](./README.md)

# Refactorings

> [!note]
>
> This is a discussion on refactoring as a theoretical concept.
> [Look here](../lang-reference/refactorings/README.md) for example refactorings in Clawr.

The term “Refactoring” is used loosely in software development to mean redesigns or improvements to the code structure with no apparent implied discipline. There is an expectation that the changes improve the code in some way, but the colloquial use of the term does not seem to imply any inherently systematic or disciplined approach.

There is a different, more disciplined understanding of refactoring both within and outside the context of TDD, where refactorings are systematic, incremental improvements to the code that preserve its behavior.

> [!quote]
>
> Refactoring is a very specific technique, founded on using small behavior-preserving transformations (themselves called refactorings). If you are doing refactoring your system should not be broken for more than a few minutes at a time, and I don't see how you do it on something that doesn't have a well defined behavior.
>
> — Martin Fowler _[Refactoring Malapropism][malapropism]_

Refactoring is a concept popularized by Martin Fowler in his book [Refactoring: Improving the Design of Existing Code][refactoring-book]. (It was first published in 2006, with a second edition released in 2018.) It emphasizes making small, incremental changes to improve code structure while preserving its behavior. Fowler defines refactoring as both a noun and a verb:

> [!quote]
>
> - A refactoring (noun) is a small change to the system’s design that does not alter behaviour (and certainly does not leave the code base uncompiled for days).
> - Refactoring (verb) is the disciplined action of applying a series of small refactorings (noun) to incrementally and systematically make the code more extensible and more readable.
>
>   — Martin Fowler _[Definition of Refactoring][definition-of-refactoring]_

## Test-Driven Development (TDD)

Refactorings are a key part of the Test-Driven Development (TDD) cycle, a development approach that emphasizes writing tests before implementing the corresponding functionality.

1. Write a failing test.
2. Make the test pass.
3. Refactor the code while keeping the test passing.

Step 3, refactoring, is crucial because it ensures that the code remains clean, maintainable, and adaptable to future changes. By continuously improving the design, developers can prevent technical debt from accumulating and keep the codebase healthy.

Many who have failed applying TDD have assigned the blame for their diminished productivity to the TDD process itself, when the real issue most likely was a lack of understanding of proper design principles.

TDD will not work for you if you do not understand how to refactor code effectively while keeping tests passing. And it also will not work if you do not know what design to target with your refactorings. Without this understanding, your code will likely degrade over time _despite_ following the TDD cycle.

Such understanding takes time to develop and requires practice. It involves recognizing code smells, understanding design principles, and knowing which refactorings to apply in different situations. But the gains are substantial, as it enables developers to maintain high-quality code, reduce technical debt, and adapt to changing requirements with confidence.

[refactoring-book]: https://martinfowler.com/books/refactoring.html
[definition-of-refactoring]: https://martinfowler.com/bliki/DefinitionOfRefactoring.html
[malapropism]: https://martinfowler.com/bliki/RefactoringMalapropism.html
