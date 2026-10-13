<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Clawr Intermediate Representation

Clawr is not a compiler. It is a language specification. Teams are expected to create multiple compiler implementations targeting various hardware/OS configurations. And maybe offering different levels of optimization. There might be an officially recommended compiler for your platform, but there can be several alternatives that could be a better fit your specific situation.

The specification assumes a separation between a frontend and a backend. The responsibility of the frontend is language interpretation and “static” semantic analysis. The Clawr Intermediate Representation (CIR) communicates that analysis to the backend. The responsibility of the backend is to “lower” the CIR specification to executable machine code targeting the platform of choice.

Clawr is hardware agnostic and the same frontend should be reusable for multiple custom backends. It can in theory be written once as a single canonical library, reused by multiple backend teams and integrated with their implementations. But multiple frontend implementations are allowed, offering different optimizations or other capabilities. The backend is **assumed to come in many flavours** for servicing unique and exotic hardware and/or operating systems.

This document uses [RFC 2119](https://www.rfc-editor.org/info/rfc2119/) ([BCP 14](https://www.rfc-editor.org/info/bcp14/)) terminology. The backend `MAY` freely define its own lowering strategy and optimizations. It `MUST` however honour the semantics defined in this document.

The [CIR JSON Schema](https://raw.githubusercontent.com/clawrlang/clawr/refs/heads/main/packages/cir/cir.schema.json) defines the serialized format documented here.

The headings in this reference use the serialized discriminator values: `kind` for nodes and `universe` for value-sets. The schema organizes its definitions under `$defs` names, which do not always match those values, so the mapping may not be obvious when browsing the schema alone. Each snippet points to the relevant definition; its `properties.kind.const` or `properties.universe.const` constraint identifies the matching heading.

## Module Root

A _module_ is a single .clawr code file. The file `MAY` contain a single `@main {}` block for running the program. It also `MAY` contain type, function and variable [`declarations`](declarations/README.md).

```json
{ "$ref": "./cir.schema.json" }
```

[Click here](./module.md) for details

## Module Components

The `declarations` property [declares](declarations/README.md) the (internal and external) types, functions and variables that the module defines.

```json
{ "$ref": "./cir.schema.json#/$defs/Declaration" }
```

The `startBlock` defines the [statements](./statements/README.md) that are executed when the program runs.

```json
{ "$ref": "./cir.schema.json#/$defs/Statement" }
```

There are also [expressions](./expressions/README.md) that are used as arguments to the statements (and to other expressions).

```json
{ "$ref": "./cir.schema.json#/$defs/Expression" }
```

Types, functions and variables use [lattices](./lattices/README.md) to constrain what data is passed around the program.

```json
{ "$ref": "./cir.schema.json#/$defs/ValueSet" }
```
