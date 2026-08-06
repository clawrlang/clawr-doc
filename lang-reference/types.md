<!-- markdownlint-disable MD041 MD033 -->
<img src="/images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Built-in Types in Clawr

- `integer`: an arbitrarily sized integer value.
- `truthvalue`: a value with three states (`false`, `ambiguous` and `true`)
- `string`: a fixed list or sequence of characters

These are foundational types that can be aggregated into `data` structures and other [user-defined types](./user-types/README.md).

Types can also be created by [forming subsets](./sets.md).

## Additional Proposed Types

- `real`: a floating-point value of unspecified precision.
- `character`: this could be simple as in C or more complex as in Swift
- `regex`: a regular expression/pattern for string matching
- `error`: a type for indicating issues at runtime
- _lambda_: a callable function with a specific signature
- _tuple_: a list of values of varying (but specific) types
- _array_: ordered collection with fixed size (`[T]` / `Array<T>`)

## `integer`

The `integer` type supports any number in $\mathbb{Z}$.

An `integer` value can be arbitrarily large — only limited by the physical size of the computer it is running on, and the time it takes to perform operations on it.

> [!note]
> It may require a custom backend to do this efficiently enough for frontier mathematics, but the modular nature of Clawr should make custom backends the rule, not the exception.

Other languages typically define fixed-size types such as `u32` and `i64`. These types may still be used behind the scenes if the compiler can prove that the value of the variable stays within the appropriate range, but they are not visible to the programmer.

Instead, the programmer defines ranges that the value must remain in. The compiler ensures that those limits are not exceeded. Either by an error at compile-time or by a runtime error.

A `const` `integer` is a value that is known exactly. Depending on context, the value might be stored efficiently or just injected into the machine code using the representation that best fits the use location, much like `#define` in C.

```clawr
mut count: integer 
// Arbitrary size. This could have a googol digits if there
// were computers that could handle it.


mut age: integer(0..<150)
// Limited in size. The compiler might use a single byte to represent it.


const x = 42
// The exact value of x is known and will never change.
// The compiler might inject the raw number 42 wherever `x` is referenced.
```

### Ternary Base

A number is just a conceptual idea (think [ZFC](https://en.wikipedia.org/wiki/Zermelo–Fraenkel_set_theory) [^anotherroof] or the [Peano axioms](https://en.wikipedia.org/wiki/Peano_axioms)). We represent numbers in many different ways: binary, decimal, octal, hexadecimal, Roman… Apart from Roman, the listed examples are all positional (positive) base systems. Any value can be written uniquely on the form $a_0 \cdot b^0 + a_1 \cdot b^1 + a_2 \cdot b^2 + …$ We could choose any number as our base, $b$. A popular alternative to binary hardware is _balanced ternary_ (-1, 0, +1). We do not have to limit ourselves to positive numbers, and an odd base is ideal for centering the zero. This documentation has a [dedicated section](../ternary/numbers.md) that delves deeper into [ternary numbers](../ternary/numbers.md) and arithmetics.

[^anotherroof]: ZFC has been beautifully explained by [Another Roof](https://youtu.be/dKtsjQtigag?si=Ct1JHi-778aodsSi) on YouTube. This video — and the series it starts — is a recommended watch for anyone who wants to understand the logical foundation of mathematics.

I do not like the idea of material implication. I sometimes see mathematicians equate the expressions $a \Rightarrow b$ with $\neg a \lor b$.

A computer that uses ternary chipsets might be created in the future. The agnostic nature of Clawr makes such a transition seamless. All that is needed is a compiler backend that supports the specific chipset. The CIR is designed in such a way that the implementation should be (relatively) simple. There would obviously need to be a way of generating the machine code for the processor, but building an adapter that translates from CIR to whatever input language that tool understands should not be difficult.

## `real`

> [!warning]
>
> Not Implemented
> The design and representation of `real` numbers might change 

The `real` type supports any number in $\mathbb{R}$. It can, in theory, hold arbitrarily large values with arbitrary precision. Like `integer`, `real` numbers can be stored in an optimal way if the number is well known. The default precision uses 50 decimal digits.

## `truthvalue`

The Boolean type in Clawr. Apart from the standard `true` and `false`, there is a third value, `ambiguous`. The `ambiguous` value is neither `true` nor `false`, when using it in control-flow logic, it counts as `false`, but negating it (`!`) does not make it `true`.

```clawr
if ternaryValue { print("ternaryValue is true") }
else { print("ternaryValue is either false or ambiguous") }

if !ternaryValue { print("ternaryValue is false") }
else { print("ternaryValue is either true or ambiguous") }
```

### `boolean`

> [!warning]
>
> Not Implemented
> The `subset` syntax is not yet parsed

There is also a `boolean` subset. A `boolean` value is a `truthvalue`, except it is not allowed to be `ambiguous`.

Syntax forms under consideration:

```clawr
subset boolean = truthvalue(false|true)
subset boolean is truthvalue(false|true)
subset boolean : truthvalue(false|true)

subset boolean = truthvalue @values(false, true)
subset boolean = truthvalue @except(ambiguous)
```

## Ternary Hardware

Clawr is compatible with any hardware that has an implemented lowering strategy. That includes being agnostic to the numeric base. All types function just as well on ternary hardware as on binary.

Numbers are just numbers. While a balanced base (-1, 0, +1) is recommended, Clawr functions just as well on a biased positive base (0, 1, 2). The backend determines the lowering strategy and the frontend will be unaffected. There will be no syntactic or semantic difference to the programmer, and source code can be fully reused.

A `truthvalue` is designed for ternary hardware. A ternary trit can represent all three values. On binary hardware a `truthvalue` will need two bits to be able to represent all three values, but when limited to the `boolean` subset (`false`, `true`), the backend might optimise to using a single bit.
