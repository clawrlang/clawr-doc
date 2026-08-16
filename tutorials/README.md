<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Clawr Language Tutorials

Welcome! This is the place for language learners.

## Fossilised Thought

Programming is an **intellectual** job, not mere production. The programmer writes source code to solve problems. Once a problem has been solved, that knowledge is valuable and the solution itself might be reused in a different context after some adaptive edits.

Or maybe the solution looks good at conception, but then new understanding emerges to render it invalid. Or maybe the only solution they can think of is a terrible hack! It would be remiss of the team not to implementation that solution even so: solving the problem now is better than waiting indefinitely for perfection. When new information is revealed, the team can adjust or replace the solution.

The result is already a document — an instruction — of _how_ the processor performs the chosen solution. It is perhaps negligent of the programmer not to also describe _what_ problem it solves so the better solution can be generated. How are future programmers supposed to know that their edits do not break something important if all. they can read is the _mechanics_ of a solution? And how can they ever come up with new, better solutions?

Clawr is designed to distance the programmer from mechanics and instead document their domain. Instead of value-semantics and reference-semantics _types_, Clawr uses _variable_ semantics. And type design is instead a clear decision between encapsulation — driven by behaviour, invariants and rules — versus naked data — driven by describing structure that can never be considered “invalid.”

Clawr source code tries to become that document that not only describes _how_ to solve a problem, but _which_ problem was chosen. And — to some degree — maybe even _why_!

### What Is a Language?

Language is a tool for communication. Human communication likely began with gestures, facial expressions, and simple vocalizations. As our anatomy and social structures evolved, so did our ability to express complex ideas. Eventually, writing allowed knowledge to be recorded and passed across generations.

Source code — the language of programmers — does all that too, just in a different form and for a specific ultimate purpose: to run on a machine and to be read by other programmers.

## Why This Matters for You

As you learn Clawr, you're not just learning how to tell a computer what to do. You're learning how to write an executable document — one that tells the computer what to do, tells other humans what it means, and explains why it exists.

That's what these tutorials are about. Let's [get started](hello-world.md) with Clawr.

Or if you want the _in medias res_ experience, here are links directly to specific topics:

- [Data Structures](./data-structures.md)
- [Encapsulation](./encapsulation.md)
- [Inheritance](./inheritance.md)

> [!todo]
> The documentation here should include a getting-started tutorial and different kinds of educationals that encourage incremental understanding of Clawr, object-oriented programming and outside-in design.
>
> - It should encourage purpose-revealing designs and traceability of purpose.
> - Code should exist because it is needed/used by other code that have a deeper meaning and is closer to the core purpose.
