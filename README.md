<!-- markdownlint-disable MD041 MD033 -->
<img src="./images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Clawr Documentation

Clawr is a language with three main goals: clarity, a focus on modelling, and easy refactoring. The name is a portmanteau of the word “clarity,” and a lion’s roar (or “rawr”). The fact that the first four letters spell out the word _claw_ is a nice bonus.

This repository contains documentation for the Clawr language. The documentation is separated into four sections:

- [Learning the Language](./language/README.md)
- [Language Reference](./lang-reference/README.md)
- [Standard Library Reference](./std-lib/README.md)
- [IDE Extensions](./ide-reference/README.md)
- [CIR Reference](./cir-reference/README.md)

The [Language Reference](./lang-reference/README.md) details the syntax and semantics of Clawr source code.

The [Standard Library Reference](./std-lib/README.md) details the functions and types that are part of Clawr’s standard library.

The [IDE Extensions](./ide-reference/README.md) section provides information about creating syntax coloring and diagnostics for editors.

The [CIR Reference](./cir-reference/README.md) describes the data structure used to communicate from frontend to backend. The frontend is the tool that reads and interprets a .clawr file and enforces all the semantic rules. The backend is the tool that converts (“lowers”) the CIR into executable machine code. The two tools could be developed by different teams.

## The Clawr Architecture

1. A programmer writes Clawr source code.
2. The frontend tokenises and parses the source code, performs static and semantic analysis of the parsed program, and outputs a JSON file (“the CIR”).
3. The backend translates (“lowers”) the CIR into machine-executable code.

The source code syntax and semantics are part of the Clawr definition. So are the structure and the semantic meaning of the CIR.

Clawr does _not_ mandate the strategies employed by either the frontend or the backend.

> [!tip]
> Clawr is a language specification, not a compiler implementation. There is no _official_ Clawr compiler. While there is an implementation that could be granted official status (or maybe rather **recommended** status), it is limited in scope (binary hardware and only tested on macOS). It can at best be made **one of several** official compilers, each targeting a different hardware/OS platform, each using a different strategy, and each offering different optimizations.

## Other Repositories

The main repository for (early) Clawr development is <https://github.com/clawrlang/clawr>. There is also a Visual Studio Code extension at <https://github.com/clawrlang/vscode-extension>.

- [MIT License](./LICENSE)
- [How to contribute](./CONTRIBUTING)
