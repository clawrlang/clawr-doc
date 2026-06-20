<!-- markdownlint-disable MD041 MD033 -->
<img src="/images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Clawr Documentation

Clawr is a language with three main goals: clarity, a focus on modelling, and easy refactoring. The name is a portmanteau of the word “clarity,” and a lion’s roar (or “rawr”). Thefact that the first four letters spell out the word _claw_ is a nice bonus.

> [!tip]
> Clawr is a language specification, not a compiler implementation. There is no _official_ Clawr compiler. While there is an implementation that could be granted official status, it is limited in scope (binary hardware and only tested on macOS) and can at best be made _one of several_ official compilers, each targeting a different hardware/OS platform, each using a different strategy, and each offering different optimizations.

This repository contains documentation for the Clawr language. The documentation is separated into three planned sections:

- [Learning the Language](./language/README.md)
- [API Reference](./api-reference/README.md)
- [IR Reference](./ir-reference/README.md)

The API reference details the functions and types that are part of Clawr’s standard library.

The IR reference describes the data structure used to communicate from frontend to backend. The frontend is the tool that reads and interprets a .clawr file and generates the IR structure, and the backend is the tool that converts the IR into executable machine code. The tools could be implemented by different teams.

Clawr is hardware agnostic and the backend is free to define its own ABI and runtime implementation. Clawr defines the syntax and semantics of .clawr source code as well as an intermediate representation (IR) that is passed from the frontend to the backend. The frontend can in theory be written once and reused, but other frontend implementations are allowed offering better optimizations or capable of running on various platforms. The backend is _assumed_ to come in many unique flavours.

## The Clawr Architecture

1. A programmer writes Clawr source code
2. The frontend tokenises and parses the source code, performs static and semantic analysis of the parsed program, and outputs an AST
3. The backend translates (“lowers”) the AST into machine-executable code

The source code syntax and semantics are part of the Clawr definition. So are the structure and the semantic meaning of the AST.

Clawr does _not_ define the strategies employed by either the frontend or the backend.

## Other Repositories

The main repository for Clawr development is <https://github.com/clawrlang/clawr>. There is also a Visual Studio Code extension at <https://github.com/clawrlang/vscode-extension>.

- [MIT License](./LICENSE)
- [How to contribute](./CONTRIBUTING)
