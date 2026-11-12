&nbsp; / &nbsp; [The Clawr Language](../README.md)

# Isolation vs Sharing

Isolation and sharing are fundamental concepts in the Clawr language. They define how to reason about the evolving state of variables. An isolated variable can only be modified by name, while a reference variable shares its state with other references.

Other languages use terms like value semantics and reference semantics to describe similar concepts. Value semantics correspond to isolated variables in Clawr, where each variable has its own independent copy of the data. Reference semantics correspond to reference variables, where multiple variables can refer to and modify the same underlying data.

A [mental model](../../../guides/theory/drawers-and-boxes.md) can help in understanding the distinction.
