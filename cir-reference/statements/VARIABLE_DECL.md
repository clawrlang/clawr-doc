<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `VARIABLE_DECL`

[CIR](../README.md) : [Statements](./README.md)

A `VARIABLE_DECL` defines a variable. Variables store values as the application runs. Some variables (“constants”) remain unchanged from inception until destruction. Others are updated frequently.

`VARIABLE_DECL` `MAY` be used as a statement (a local variable in a function) or as a module-level declaration (available to all code in the module and — through a namespace reference — to the entire application).

```ts
type VariableDeclaration = {
  kind: 'VARIABLE_DECL'
  name: string
  namespace?: string
  lattice: Lattice
  initialValue: Expression
}
```

The `name` property names the variable.

The `lattice` property identifies the type of the variable. Its intent is to help the backend declare an appropriate storage type for lowering.

The `inititalValue` property indicates the starting value of the variable.

## Rules for Frontend

- A `VARIABLE_DECL` that reference a type `MUST` appear after the corresponding `RC_TYPE_DECL`.
- If a `VARIABLE_DECL` calls a function for its initial value, the `FUNCTION_DECL` `MUST` appear before it in the module `declarations` array.
- Each `VARIABLE_DECL` `MUST` have a unique `name` in its scope (i.e. unique when including the optional `namespace`). That uniqueness includes types and functions.
- A local variable `MAY` shadow another variable defined in the parent scope. Shadowed variables become effectively inaccessible as if replaced by their shadows. But when the shadowing scope is exited, the shadowed variables are once again there.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.
- The `initialValue` expression must be compatible with the `lattice`.

## Rules for Backend

- All module-scope variables `MUST` be initialized before executing any statements that depend on them.
- Global variables in an executable `MUST` be initialized before the `startBody` statements are executed.
- Global variables in a library `MUST` be initialized before any (other) library code is executed.
- The `initialValue` is an expression that `MUST` be called and assigned to the variable when it is declared. The backend `MAY` serialise the value as machine code data if it is simple enough.
- The backend `MAY` optimize the storage of the variable if its possible values are small enough, but it `MUST` use a storage size that can fit all possible values as declared by the `lattice` (as long as there is enough available memory). An unconstrained `integer` for example will need arbitrary precision, while an `integer` with `max` and `min` values might fit inside a `uint64_t` (C type), or even a single `byte`.

> [!note]
>
> Mutability and `const`ness are presumed to be inconsequential to the process of lowering. Immutability is enforced by the frontend and not a concern for the backend. All variables `MUST` be lowered in a way that allows mutation.

> [!tip]
> If lowering via C, the backend might use `__attribute__((constructor))` to initialize module-level variables in executables, and use guarded `static` variables for libraries.
