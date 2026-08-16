<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

[data structures >](./data-structures.md)

# Hello World

It is customary to start language introduction with a Hello-World example. It is maybe the simplest possible program in any language. It shows how to output a greeting to the terminal console.

In Clawr, the basic program looks like this:

```clawr
@main { print("Hello, World!") }
```

Even this tiny example has several components:

- `@main` marks the main body of the program — the _statements_ that will be processed when it is executed.
- `print(...)` is a function called with a single argument.
- `"Hello, World!"` is a `string` _literal_.

A _statement_ is the main tool for a program. Statements are the instructions describing what the program is supposed to do. A statement can output text to the console (as our `print` function does here), but it can also update the application state, persist data in a database, draw an image on the screen, send data across the Internet, or many other things. It is virtually unlimited what a statement might do. As long as hardware exists to physically perform the task it might launch a rocket into space, start an entry burn near Mars, move a rover around on the surface…

Statements often need values to operate with. These values are in the form of _expressions_. The simplest possible expression is a _literal_. A literal is a direct notation of some value. A `string` in this case is simply a representation of text — a string of characters. Other literals include explicit numbers and truth-values. (And `data` literals which we will talk more about in the next part.)

## A Small Refactoring

The same example can be written with an intermediate constant, like this:

```clawr
@main {
  const greeting = "Hello, World!"
  print(greeting)
}
```

This version does the same thing, but it gives the `string` a name. That matters once programs grow beyond a single line, because a well-named constant can communicate its purpose better than a literal value. It can also be reused multiple times in a single program.

Here is an example that defines multiple constants:

```clawr
@main {
  const pi = 3.14159
  const radius = 1
  const area = 2 * pi * radius
  const volume = pi * radius^2

  print("The area of a circle with radius 1:")  
  print(area)
  print("The volume of the same circle:")  
  print(volume)
}
```

As you can see here, the value of a constant does not have to be a simple literal. It can also be evaluated from a more complex expression, like multiplication or exponentiation.

## Next

[data structures >](./data-structures.md)

## Boundary

This page is a learning guide. For the current parser-backed syntax and language surface, use [reference/lexical-and-syntax.md](../reference/lexical-and-syntax.md) and [reference/grammar.md](../reference/grammar.md).

[data structures >](./data-structures.md)
