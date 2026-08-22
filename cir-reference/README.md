<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Clawr Intermediate Representation

Clawr is not a compiler. It is a language specification. Teams are expected to create multiple compiler implementations targeting various hardware/OS configurations. And maybe offering different levels of optimization. There might be an officially recommended compiler for your platform, but there can be several alternatives that could be a better fit your specific situation.

The specification assumes a separation between a frontend and a backend. The responsibility of the frontend is language interpretation and “static” semantic analysis. The Clawr Intermediate Representation (CIR) communicates that analysis to the backend. The responsibility of the backend is to “lower” the CIR specification to executable machine code targeting the platform of choice.

Clawr is hardware agnostic and the same frontend should be reusable for multiple custom backends. It can in theory be written once as a single canonical library, reused by multiple backend teams and integrated with their implementations. But multiple frontend implementations are allowed, offering different optimizations or other capabilities. The backend is **assumed to come in many flavours** for servicing unique and exotic hardware and/or operating systems.

This document uses [RFC 2119](https://www.rfc-editor.org/info/rfc2119/) ([BCP 14](https://www.rfc-editor.org/info/bcp14/)) terminology. The backend `MAY` freely define its own lowering strategy and optimizations. It `MUST` however honour the semantics defined in this document.

The CIR is defined using TypeScript in <https://github.com/clawrlang/clawr/blob/main/src/cir/index.ts>. That code is duplicated here for easy reference but it might be out of sync. Please refer to the source for the official truth.

There is no official JSON schema at this time, but a preliminary schema identifier has been invented: `"http://clawr.lang/schema/cir/DRAFT-0"`. If we can secure that domain name, we can export the definitions to the JSON schema format and publish it on that URL. Alternatively, we could secure a different domain name and update the `$schema` property accordingly.

## Module Root

A _module_ is a single .clawr code file. The file `MAY` contain a single `@main {}` block for running the program. It also `MAY` contain type, function and variable [`declarations`](declarations/README.md).

```ts
type ClawrModule = {
  $schema: 'http://clawr.lang/schema/cir/DRAFT-0'
  startBlock?: Statement[]
  declarations?: Declaration[]
}
```

[Click here](./module.md) for details

## Module Components

The `declarations` property [declares](declarations/README.md) the (internal and external) types, functions and variables that the module defines.

```ts
type Declaration = { namespace?: string } & (
  | VariableDeclaration
  | FunctionDeclaration
  | TypeDeclaration
)
```

The `startBlock` defines the [statements](./statements/README.md) that are executed when the program runs.

```ts
type Statement =
  | EnsureUnique
  | Release
  | FunctionCall
  | Return
  | VariableDeclaration
  | Assign
```

There are also [expressions](./expressions/README.md) that are used as arguments to the statements (and to other expressions).

```ts
type Expression =
  | StringLiteral
  | IntegerLiteral<bigint>
  | TruthLiteral<truthvalue>
  | MemoryAllocation
  | MemoryRetention
  | AsShared
  | VariableReference
  | FieldReference
  | (FunctionCall & { value: Lattice })
```

Types, functions and variables use [value-sets](./lattices/README.md) to constrain what data is passed around the program.

```ts
type Lattice =
  | IntegerLattice<bigint | undefined, bigint | undefined>
  | RealLattice
  | TruthvalueLattice<truthvalue[]>
  | StringLattice
  | RCTypeLattice
```
