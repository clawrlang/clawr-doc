<!-- markdownlint-disable MD041 MD033 -->
<img src="/images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# Balanced Ternary Notation

> [!note]
> This document assumes that we agree what a number is. I recommend [Another Roof on YouTube](https://youtu.be/dKtsjQtigag?si=Ct1JHi-778aodsSi) if you want a rigorous, yet pedagogic, explanation of [the ZFC definition](https://en.wikipedia.org/wiki/Zermelo–Fraenkel_set_theory).

There are two ternary notation systems, standard and balanced. The standard variation (a.k.a. “biased,” “positive” and “unbalanced”) works exactly like other positional notation systems we may be more familiar with: binary, octal, decimal, dozenal, hexadecimal… It simply uses the integer value $3$ as its base, and the digits $0$, $1$ and $2$.

Every positional system defines a base, $b$, and a set of $b$ distinct digits, $\mathbb{D}$. Every real number $x$ is expressed as a sequence of digits $d_i \in \mathbb{D}$ such that:

$$x = \sum_i d_i \cdot b^i = … + d_2 \cdot b^2 + d_1 \cdot b^1 + d_0 \cdot b^0 + d_{-1} \cdot b^{-1} + d_{-2} \cdot b^{-2} + …$$

Notations typically add a dot or comma to denote which digit is $d_0$ and which is $d_{-1}$. And to avoid writing infinite digits, the number zero is omitted to the left of the most significant (non-zero) digit (if it is to the left of the separator) and the same for zeros to the right of the least significant non-zero digit (if it is to the right of the separator). The separator itself is typically elided if the number is an integer (i.e. it has only zero-valued digits to the right of the separator).

The _balanced_ ternary system switches the digit $2$ in standard ternary for a digit with the value $-1$. This has some benefits and some drawbacks. The pros seem to outweigh the cons however.

One advantage is in how to construct the negative of a value. It’s a simple matter of flipping the sign on every digit: $+1$ becomes $-1$ and vice versa.

> [!tip]
> This can make ALUs simpler. Subtraction does not need a dedicated structure of transistors; you can just invert the digits of the subtrahend and then perform addition. (Because $a - b = a + (-b)$.)
>
> This is however already standard practice in binary ALUs. The negative is slightly more complex in that it needs to add 1 after flipping all bits, but that addition is done efficiently (for integers) by using the carry-in on the first adder. I have not examined how this affects floating-point values

It also means that there is no need for an explicit minus sign. If the most significant digit (MSD) is negative, the entire value is negative. And if the MSD is plus one, the entire value is positive.

A third benefit is that the absolute value of a digit has only two possible values: zero or one, and standard algorithm multiplication becomes much simplified. The step of multiplying digits to prepare for addition becomes just a matter of copying them (shifted). This is similar to binary multiplication. The difference is that when the multiplicand is negative, the “copied” digits must be negated.

Rounding is also rather beautiful in balanced ternary: it is a simple act of truncation. If you truncate a number in a positive base, you always “round” toward zero, which is incorrect if rounding up would have a shorter distance. In a balanced base, truncation always rounds to the nearest.

The only major negative is perhaps that of intuition. A number with negative digits is not easily understood by human minds. An issue that can be mitigated by simply not exposing the “ternary-ness” to most users. (This is Clawr’s approach. A programmer does not need to know if numbers are stored as binary or ternary; it is just a number.)

## the Counting Numbers

So how is a balanced ternary number constructed? Let’s start with the counting numbers to get a feel for it.

Oh! And yes, we will need a symbol to denote each digit value. Let’s use `+` to denote $+1$ and `-` to denote $-1$. We can refer to the digits as “plus-one” and “minus-one” respectively. For the zero value, let’s simply use the familiar `0`.

Then the natural counting numbers (1, 2, 3, 4, 5, 6, …) will be written as `+`, `+-`, `+0`, `++`, `+--`, `+-0`, …

How does this work? Well, when we count to the next value in any base, we always replace the right-most digit with the digit whose value is one more until we get to the highest-value digit. When we’ve reached the highest valued digit, we next “roll over,” replacing the digit with the lowest digit in the number system. And then we increment the next digit to the left to compensate.

We can see this clearly (and intuitively) in decimal: after 19 comes 20 and after 29 comes 30. The 9 “rolls over“ to zero and pushes up the next digit on its left. If that digit is a nine it too rolls over pushing the next digit etc. So a value like 1,999,999 becomes 2,000,000. We are used to this behaviour. Most people learn the pattern early in life.

In positive bases, the lowest digit value is `0`, but in balanced tenary it is `-`. This might take some getting used to, but the pattern is the same. If we let `x` denote “any digit,” the next counting number after `…x-`is `…x0` (because $0 = (-1) + 1$), and counting up from `…x0` yields `…x+`. Counting up from `…x+` is not defined unless we know what that last `x` is, so let’s specify it: counting up from `…x-+` yields `…x0-` and counting up from `…x0+` yields `…x+-`.

## Converting from Decimal

Interpreting a given ternary number is relatively easy. By the general positional number system, the ternary notation `+-0` represents $1 \times 3^2 + (-1) \times 3^1 + 0 \times 3^0$. That evaluates to the value 6. To take a longer example (of randomly selected digits), `+0++--+00+` evaluates as:

$$1 \cdot 3^9 + 0 \cdot 3^8 + 1 \cdot 3^7 + 1 \cdot 3^6 + (-1) \cdot 3^5 + (-1) \cdot 3^4 + 1 \cdot 3^3 + 0 \cdot 3^2 + 0 \cdot 3^1 + 1 \cdot 3^0$$

This expression has the value $22,303$ in “normal” decimal form.

To generate a ternary number is harder. There are two methods. The intuitive method is to start with the most significant digit (MSD) and build the notation from left to right. That is however not as easy as you might believe. The recommended method is to build it from right to left using the following algorithm:

1. Start with an accumulated output that is empty.
2. Divide the input by three and write the result as a quotient and remainder..
3. If the remainder is ±2, rewrite the result so that the remainder is ±1 and use that as the current digit instead.
4. Add the current digit to the left of the accumulated output.
5. If the quotient is z, we are done. Otherwise, repeat from 2 using the quotient of the result as the new input.

Let’s see this in action using the number $833$ as our input.

$833 / 3 = 277 {2\over 3}$. Since we do not like the remainder 2, we rewrite the result as $278 + {-1\over 3}$. We get $q = 278$ and $r = -1$. This $r$ value is the value of our least significant digit, LSD, and is written as `-`. We add that to our output (which was empty before) and our output becomes the digit itself. Since our quotient, $278$ is non-zero, we repeat the process.

$278 / 3 = 92 {2 \over 3} = 93 + {-1 \over 3}$. We add another `-` digit to the left of the accumulated output, which is now `--`. Then we repeat again, now with $93$ as input. This continues as illustrated by the following table:

| Input |          Input / 3 |   $q$ |    $r \over 3$ | Digit | Acc. Output |
| ----: | -----------------: | ----: | -------------: | ----- | ----------: |
| $833$ | $277 {2 \over 3 }$ | $278$ | $-{1 \over 3}$ | `-`   |         `-` |
| $278$ |   $92 {2 \over 3}$ |  $93$ | $-{1 \over 3}$ | `-`   |        `--` |
|  $93$ |               $31$ |  $31$ |    $0 \over 3$ | `0`   |       `0--` |
|  $31$ |  $10 {1 \over 3 }$ |  $10$ |    $1 \over 3$ | `+`   |      `+0--` |
|  $10$ |   $3 {1 \over 3 }$ |   $3$ |    $1 \over 3$ | `+`   |     `++0--` |
|   $3$ |                $1$ |   $1$ |    $0 \over 3$ | `0`   |    `0++0--` |
|   $1$ |     ${1 \over 3 }$ |   $0$ |    $1 \over 3$ | `+`   |   `+0++0--` |

And this is where we stop. When the quotient $q$ reaches $0$, the result is the so far accumulated output: `+0++0--`.

### Going from Left to Right

Let’s see how we would do this left-to-right. The first digit represents the value $1 \cdot 3^6 = 729$. How do we know to start there? Well, the only way to find that value — if we did not already know it — is either to guess or to know your logarithms. As $log_3(833) ≈ 6.121$, this tells us that the number is between $3^6 = 729$ (a plus-one followed by 6 ternary zeroes) and $3^7 = 2,187$ (seven ternary zeroes). In standard (positive) notations, we simply choose the lower power, but in balanced ternary we have to contend with negative digits which subtract from the total rather than add to it. How do we know when we should choose the higher power and when to choose the lower?

The answer is hidden in the expression $3^n - 1 \over 2$. That is the largest (positive) integer that can be written using $n$ balanced ternary digits. If our first digit is a plus-one in the $3^n$ position, the largest possible integer we can form using only smaller-powers — we’re going left-to-right remember? — is:
$$\text{max} = 3^n + {3^n - 1 \over 2} = {3^{n+1} - 1 \over 2}$$
and the smallest integer we can form is:
$$\text{min} = 3^n - {3^n - 1 \over 2} = {3^n + 1 \over 2}$$
So we can form any integer in the range
$$\left [ {3^n + 1 \over 2}, {3^{n+1} - 1 \over 2} \right ] $$

So with 7 digits, the largest number we can form is ${3^7 - 1 \over 2} = 1,093$. If we start with a plus-one in the $3^7$ position, we will not be able to write any value smaller than ${3^7 + 1 \over 2} = 1,094$. If we choose the $3^6$ position on the other hand, we can form any value between ${3^6 + 1 \over 2} = 365$ and ${3^{6+1} - 1 \over 2} = 1,093$.

The upper limit from picking the lower power digit and the lower limit from picking the next larger power are near identical. In fact they have a difference of exactly one (without overlap). This is a fact that is inherent to the positional system and the reason why positional systems work in general. [^caveat] We can name one of these values (it does not matter which one, but let’s pick the smaller just to make a choice) the “midpoint value.” This can be seen as a kind of mean between powers of three, and it helps illustrate the algorithm I have in mind.

> [!note]
> The midpoint value isn't an arithmetic or geometric mean. For example it is consistently closer (in absolute terms) to the smaller candidate than the larger. But it functions much like a mean: it is a balance point between two successive powers of three.

[^caveat]: The rule is incorrect as stated. For example: $19_{10} + 1 ≠ 100_{10}$. But it works superficially, which is close enough for our purposes.

As long as we choose our digit position (and with that an even power of three) such that the target value lies on its side of the midpoint value, we will always be able to use progressively lesser positions to eventually land on the target. If we ever pick a power that does not include the target value in its range, we cannot succeed without going back to make amends.

For our example ($833$), our most significant digit is therefore a `+` symbol in the $3^6$ position. If we subtract that value from our input we have the value the remaining digits need to total.

Let’s repeat the same pattern for that value ($104$), find its neighbouring powers of three and select the “closest” one. That places a plus-one in the position for $3^4 = 81$. If we imagine that we started with an infinite string of zeroes, there is no need to pay extra attention to the $3^5$ position as there will already be a zero in that place.

If we repeat the same pattern over and over again until the input is zero, we will have built our output like this:

| Input |           Range | Midpoint | Selected Position | Digit |    Output |
| ----: | --------------: | -------: | ----------------: | :---: | --------: |
| $833$ | $729 \to 2,187$ |  $1,093$ |       $3^6 = 729$ |  `+`  | `+000000` |
| $104$ |    $81 \to 243$ |    $122$ |        $3^4 = 81$ |  `+`  | `+0+0000` |
|  $23$ |      $9 \to 27$ |     $13$ |        $3^3 = 27$ |  `+`  | `+0++000` |
|  $-4$ |       $3 \to 9$ |      $4$ |         $3^1 = 3$ |  `-`  | `+0++0-0` |
|  $-1$ |       $1 \to 3$ |      $1$ |         $3^0 = 1$ |  `-`  | `+0++0--` |

In the last two steps, we are dead on the midpoint value (by magnitude). That is not ambiguous. Rather, it means that we are exactly at the largest value that can be represented in the remaining positions. In both cases, the input is also negative, so we enter minus-ones in the corresponding positions.

Note that when selecting candidate positions and midpoint for the final two (negative) inputs, the _magnitude_ (or absolute value) of the input is used. (That works for positive inputs as well of course.) Using negative values as they are could not place them between two positive powers of three and it would be unclear what the algorithm should do.

<script>
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  }
};
</script>
<script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
</script>
