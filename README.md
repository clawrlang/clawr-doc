# Clawr Documentation

Clawr is a language with three main goals: clarity, a focus on modelling, and easy refactoring. The name is a portmanteau of the word “clarity,” and a lion’s roar (spelled “rawr”). The fact that the first four letters spell out the word “claw” is a nice bonus.

Clawr’s mascot is the lion [Rawry](./rawry.md), symbolizing strength and clarity, and is often depicted “rawring.”

This repository is the canonical Clawr specification. It is organised in three parts:

- **[Specification](./spec/language/README.md)** is normative. Each rule is defined in exactly one place.
  - The [Language Reference](./spec/language/README.md) details the syntax and semantics of Clawr source code.
  - The [CIR Reference](./spec/cir/README.md) describes the data structure used to communicate from frontend to backend. The frontend reads and interprets a .clawr file and enforces all the semantic rules. The backend converts (“lowers”) the CIR into executable machine code. The two tools could be developed by different teams.
  - The [Conformance](./spec/conformance/README.md) checklists tell frontend and backend implementers what they must do, by linking to the rules.
  - The [Standard Library Reference](./spec/stdlib/README.md) details the functions and types that are part of Clawr’s standard library. The [Standard Library Sources](./spec/stdlib/sources.md) define the declarations and their loading order for this revision.
- **[Architecture Decision Records](./adr/README.md)** (“ADRs”) describe the reasoning behind the language design and the architecture of the compiler. They are rationale, not the place to look up the current rules.
- **Guides** are informative:
  - The [Clawr Language Tutorials](./guides/tutorials/README.md) provide step-by-step guidance for learning the language.
  - The [Theory](./guides/theory/README.md) section discusses the principles and concepts that inform the design, such as encapsulation.
  - The [Implementation](./guides/implementation/README.md) section describes the example compiler.
  - The [IDE Extensions](./guides/ide-reference/README.md) section covers syntax coloring and diagnostics for editors.

## The Clawr Architecture

1. A programmer writes Clawr source code.
2. The frontend tokenises and parses the source code, performs static and semantic analysis of the parsed program, and outputs a JSON file (“the CIR”).
3. The backend translates (“lowers”) the CIR into machine-executable code.

The source code syntax and semantics are part of the Clawr definition. So are the structure and the semantic meaning of the CIR.

Clawr does _not_ mandate the strategies employed by either the frontend or the backend.

> [!note]
>
> Clawr is a language specification, not a compiler implementation. There is no _official_ Clawr compiler. While there is an implementation that could be granted official status (or maybe rather **recommended** status), it is limited in scope (binary hardware and only tested on macOS). It can at best be made **one of several** official compilers, each targeting a different hardware/OS platform, each using a different strategy, and each offering different optimizations.

## Other Repositories

The main repository for (early) Clawr development is <https://github.com/clawrlang/clawr>.

## For Contributors

### Architecture Design Records

The ADRs are maintained in this repository. A GitHub Action syncs changes in `adr/` to the development repository.

### Clawr Intermediate Representation

The CIR JSON schema is maintained in this repository, in `spec/cir/schema/`. A GitHub Action syncs changes to the development repository.
To regenerate the tables in the CIR reference after changing the schema, execute the following script:

```sh
cd spec/cir/.import
node update-schema.ts
```

- [MIT License](./LICENSE)
- [How to contribute](./CONTRIBUTING)
