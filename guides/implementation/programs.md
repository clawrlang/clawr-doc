&nbsp; / &nbsp; [Implementation](./README.md)

# Building Multi-File Programs

This page describes the example compiler, not additional language rules. The shared scope, declaration order, and entry-point requirements are defined in [Programs and Source Modules](../../spec/language/programs.md).

## Command-Line Builds

Pass source files explicitly in their intended order:

```sh
rwrc build types.clawr main.clawr --name example -o dist
```

More than one input file requires an output name. Single-file builds retain their default output name. Duplicate input paths are rejected.

The compiler does not discover projects or read `.clawr-project` markers. When working with the [VS Code extension](../ide-reference/projects.md), pass the same files in the same lexical path order used by the editor. Put named aliases before their uses.

## Standard-Library Loading

The example compiler embeds the [standard-library sources and ordered manifest](../../spec/stdlib/sources.md) from its pinned documentation submodule during its build. A standalone executable does not need the documentation checkout at runtime.

For a fresh compiler checkout, initialize the submodule before building:

```sh
git submodule update --init --recursive
```

The pinned documentation commit must be available from the submodule remote. Edit documentation in the canonical documentation repository, publish it there, and then update the compiler's submodule pointer; do not treat the vendored checkout as a separate documentation source.
