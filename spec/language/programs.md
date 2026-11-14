&nbsp; / &nbsp; [The Clawr Language](./README.md)

# Programs and Source Modules

A **source module** is one `.clawr` source file. An executable **program** consists of an ordered collection of source modules, analyzed together.

## Scope and Declaration Order

Top-level declarations share one program scope. A source module does not currently introduce a separate namespace or visibility boundary. The implicitly available [standard library](../stdlib/sources.md) occupies a parent scope, so a program declaration can shadow a standard-library declaration.

- Duplicate declarations in the same scope are errors. Functions with different canonical names, including parameter labels and arity, can coexist.
- Sources are parsed in the supplied order. Named `subset` and `type` aliases `MUST` be declared before their uses.
- Functions and ordinary type declarations can be referenced across source modules, including before their declarations, subject to their own declaration-order rules. A supertype, for example, must precede its subtypes.
- Source locations `MUST` be retained for frontend diagnostics.

## Entry Point and CIR

An executable `MUST` contain exactly one `@main` block across all its source modules, even for a single-file program. An empty `@main {}` counts.

The frontend analyzes the source modules together and emits one [CIR artifact](../cir/module.md) for the program, not one artifact per source module. Source modules remain distinct source files; the combined artifact does not currently carry a source-module table or package identity.

This does not define import syntax, separate module scopes or exports, package identity, dependency resolution, library entry-point rules, separate compilation, or linking independently compiled artifacts. A future source-module visibility boundary remains a separate design decision.

## Working with the Example Tools

The language does not require a project marker or prescribe editor file discovery. See [building multi-file programs](../../guides/implementation/programs.md) for command-line usage and [VS Code projects and scripts](../../guides/ide-reference/projects.md) for editor behavior.

The rationale is documented in [ADR-038](../../adr/adr-038.md).
