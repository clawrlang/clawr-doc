&nbsp; / &nbsp; [The Clawr Language](./README.md)

# Control Flow

## `if` and `else`

An `if` statement evaluates a `truthvalue` condition. It executes the first block only if the result is `true`. If the result is `false` or `ambiguous`, it executes the `else` block when present; otherwise it continues after the statement.

```clawr
func describe(_ value: truthvalue) {
    if value {
        print("true")
    } else if !value {
        print("false")
    } else {
        print("ambiguous")
    }
}
```

`else if` tests another condition only when the previous condition was not `true`. Each branch has its own local scope. Assignments to variables in an enclosing scope persist after the branch; branch-local declarations are not visible outside it.

Conditions `MUST` have a `truthvalue` value-set, including the `boolean` subset. Integers and other values are not implicitly converted to truth values. Negation follows the [three-valued logic rules](./types.md#logic-operators): in particular, `!ambiguous` remains `ambiguous`.

The frontend `MUST` account for possible branch outcomes when describing values after the conditional. It `MUST NOT` retain a singleton assumption that a branch assignment can invalidate.

The CIR represents conditional statements with [`IF`](../cir/statements/IF.md). Source-level `&&` and `||` retain their [short-circuit semantics](./types.md#logic-operators); the frontend encodes that conditional evaluation explicitly rather than relying on lazy CIR logic nodes.

## `while` and `repeat`

`while condition { ... }` evaluates its condition before each iteration.
`repeat { ... } while condition` executes the body first and evaluates the
condition after each iteration. In either form, another iteration runs only
when the condition is `true`; `false` and `ambiguous` end the loop. Conditions
must have a `truthvalue` value-set, including the `boolean` subset.

```clawr
mut count: integer = 0
while count < 3 {
    count = count + 1
}
repeat {
    count = count - 1
} while count > 0
```

The condition is evaluated once per test, including its side effects and
short-circuiting. The body has a fresh local scope on each iteration. Its
declarations are not visible after the body or in a `repeat` condition;
assignments to enclosing variables persist. A `return` in the body exits the
function and releases the active local scopes.

The frontend `MUST` conservatively account for values modified by earlier
iterations and for all possible values after the loop. The CIR uses
[`LOOP`](../cir/statements/LOOP.md) for both forms.

## Future Control Flow

The example compiler currently implements `if`/`else`, `while`,
`repeat`/`while`, and prefix `!`. `for`/`in`, guards, pattern matching, and
conditional expressions remain draft designs in [ADR-039](../../adr/adr-039.md).
Their examples are not current language rules.
