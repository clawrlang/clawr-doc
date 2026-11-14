&nbsp; / &nbsp; [The Clawr Language](./README.md)

# Conditional Statements

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

## Future Control Flow

The example compiler currently implements `if`/`else` and prefix `!`. Loops, guards, pattern matching, and conditional expressions remain draft designs in [ADR-039](../../adr/adr-039.md). Their examples are not current language rules.
