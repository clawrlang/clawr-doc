# Clawr Intermediate Representation

Clawr is not a compiler. It is a language specification. Teams are expected to create multiple compiler implementations targeting various hardware/OS configurations. And maybe offering different levels of optimization. There might be an officially recommended compiler for your platform, but there can be several alternatives that could be a better fit your specific situation.

The specification assumes a separation between a frontend and a backend. The responsibility of the frontend is language interpretation and “static” semantic analysis. The Clawr Intermediate Representation (CIR) communicates that analysis to the backend. The responsibility of the backend is to “lower” the CIR specification to executable machine code targeting the platform of choice.

Clawr is hardware agnostic and the same frontend should be reusable for multiple custom backends. It can in theory be written once as a single canonical library, reused by multiple backend teams and integrated with their implementations. But multiple frontend implementations are allowed, offering different optimizations or other capabilities. The backend is **assumed to come in many flavours** for servicing unique and exotic hardware and/or operating systems.

This document uses [RFC 2119](https://www.rfc-editor.org/info/rfc2119/) ([BCP 14](https://www.rfc-editor.org/info/bcp14/)) terminology. The backend `MAY` freely define its own lowering strategy and optimizations. It `MUST` however honour the semantics defined in this document.

The [CIR JSON Schema](./schema/cir.schema.json) defines the serialized format documented here. Its referenced schema files are maintained alongside it.

The headings in this reference use the serialized discriminator values: `kind` for nodes and `universe` for value-sets. The schema's `$defs` names do not always match those values. Generated field tables summarize the schema; the schema is authoritative for structural constraints, including alternatives and restrictions that a table cannot express.

Schema validation checks the JSON structure, not every semantic rule in this reference. A CIR artifact is semantically valid only if it also follows the applicable frontend rules, including ownership and reference-counting rules. A backend may assume its input is semantically valid and lower it as specified; it may also perform additional validation and reject invalid input. Schema-valid or manually edited CIR is not necessarily safe to execute.

## Artifact Root

A source _module_ is a single `.clawr` file. A program can contain multiple source modules. The frontend analyzes them together and emits one CIR artifact for the program; the artifact does not currently preserve source-module boundaries. See [CIR artifact](./module.md) for the root fields, rules, and an example.

## Artifact Components

| Component | Purpose | Schema |
| --------- | ------- | ------ |
| [Declarations](./declarations/README.md) | Define types, functions, and global variables. | [declarations.json](./schema/declarations.json) |
| [Statements](./statements/README.md) | Describe actions in the `startBlock` and function bodies. | [statements.json](./schema/statements.json) |
| [Expressions](./expressions/README.md) | Compute values used by statements and other expressions. | [expressions.json](./schema/expressions.json) |
| [Value-set lattices](./lattices/README.md) | Describe possible values of declarations and expressions. | [valuesets.json](./schema/valuesets.json) |

## Cross-Cutting Rules

Some rules apply to many nodes. They are defined once, in their own chapters, and the node pages link to them:

- [Automatic Reference Counting](./arc.md): ownership, copy-on-write and boxing.
- [Conformance](../conformance/README.md): checklists linking frontend and backend implementers to the relevant rules.
