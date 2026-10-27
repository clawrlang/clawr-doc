# Rawry

[![Rawry](./images/rawry-150.png)](images/rawry-big.png)

Meet Roderick the Lion, known as “Rawry” for short.

Rawry is angry. He is angry at code that focuses too much on implementation and technicalities, distracting from understanding the purpose of the application and the truths of its domain. He is angry at status seeking technologists writing “clever code” that only they themselves can understand. He has patched one eye because it burns and stings when he looks at code that centers on database schemas and on the idioms of technical frameworks.

He asks that you start **solving problems** instead of “building solutions.”

> [!tip] Solve the Problem — Don’t Build a Solution!
>
> - Focus on the domain, not the technology.
> - Don’t model structures. Model what happens.
> - Be suspicious of code and tasks that cannot be traced to explicit value.
> - Be ready to change your design as needs and priorities — or just your understanding of them — evolve.

## Don’t Build a Solution

The solution doesn’t need to exist. What technology you operate, what algorithms you execute and what data structures you employ. All that is incidental and temporary. Of course **a** solution must exist for your problems to be solved, but exactly **what** solution that _is_ can change over time. It does not have to be any particular solution, not even your favourite one. Even if you love and understand your solution deeply, it is not necessarily right for the problems you are actually presented. And the more time passes, the more opportunity there is for a new concern to emerge that invalidates the solution you have built.

When you focus on technical concerns like memory management, you distract from the true purpose of your application. You will likely cement algorithms, data structures and third party tools. You will start seeing your solution as the way the world _is_. You will start believing that there is no alternative, and you will reject new functionality because “that is not how the application is built.”

That is what Rawry means by “building solutions.”

## Solve the Problem

Problems need to be solved. If you document the need (for example through tests, but also with well-modelled types and meaningful interfaces) your particular solution becomes less important. If your implementation details are motivated by an interface that communicates a specific functional need, you can replace those details easily with faster algorithms, more reliable technology, more flexible persistence or whatever else you might require. It is hard to replace technology that is the foundation of your system, but it is easy when their purpose is limited and clear.

That is what Rawry means by “solving problems.”

## Clawr is Designed for Solving Problems

Clawr is designed to distance the programmer from mechanics and instead document their domain. Instead of value-semantics and reference-semantics _types_, Clawr uses _per-variable_ choice between isolation or sharing. And type design a clear decision between encapsulation — driven by behaviour, invariants and rules — versus naked data — driven by describing structure that can never be considered “invalid.”
