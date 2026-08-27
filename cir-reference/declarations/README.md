<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Declarations

[CIR](../README.md)

Declarations are added to the top scope of a module in the `ClawrModule.declarations` array. Declarations may define types, functions or global variables. The order in which they appear is of some importance (see the rules below). As a rule of thumb, entities must be declared prior to any declarations that reference them.

```ts
type Declaration = (
  | VariableDeclaration
  | FunctionDeclaration
  | RCTypeDeclaration
  | ProtocolDeclaration
) & { namespace?: string }

type ClawrModule = {
  $schema: 'http://clawr.lang/schema/cir/DRAFT-0'
  startBlock?: Statement[]
  declarations?: Declaration[]
}
```

This document lists all declarations and their content.

## `RC_TYPE_DECL`

The `RC_TYPE_DECL` defines a type that stores its internal data in fields. The type might include `methods` for interactions. Clawr separates these types in three variants: `data`, `object` and `service`, with varying structural rules. That distinction is irrelevant to the runtime and lowering, so it is not reflected in the CIR.

```ts
type RCTypeDeclaration = {
  kind: 'RC_TYPE_DECL'
  name: string
  fields: {
    name: string
    lattice: Lattice
  }[]
} & (
  | {
      base?: CanonicalName
      methods: FunctionDeclaration[]
      initializers?: (FunctionDeclaration & { lattice?: undefined })[]
      dispatchTable?: {
        slot: FunctionSignature
        declaredIn: CanonicalName
        implementedBy?: CanonicalName
      }[]
    }
  | {}
)

type CanonicalName = { name: string; namespace?: string }
```

[Click here](RC_TYPE_DECL.md) for more details

## `PROTOCOL_DECL`

The `PROTOCOL_DECL` defines a type that stores its internal data in fields. The type might include `methods` for interactions. Clawr separates these types in three variants: `data`, `object` and `service`, with varying structural rules. That distinction is irrelevant to the runtime and lowering, so it is not reflected in the CIR.

```ts
type ProtocolDeclaration = {
  kind: 'PROTOCOL_DECL'
  name: string
  slots: FunctionSignature[]
}
```

[Click here](PROTOCOL_DECL.md) for more details

## `VARIABLE_DECL`

A variable in the module scope. The variable will be accessible to all functions and methods defined in the module.

```ts
type VariableDeclaration = {
  kind: 'VARIABLE_DECL'
  name: string
  namespace?: string
  lattice: Lattice
  initialValue: Expression
}
```

[Click here](VARIABLE_DECL.md) for more details

## `FUNCTION_DECL`

A `FUNCTION_DECL` defines a “free function” in the module, a “static” `companion` method, or a method on an `object`/`service` type.

```ts
type FunctionDeclaration = {
  kind: 'FUNCTION_DECL'
  namespace?: string
  body: Statement[]
} & FunctionSignature

type FunctionSignature = {
  baseName: string
  labels: string[]
  parameters: {
    name: string
    lattice: Lattice
  }[]
  lattice?: Lattice
}
```

[Click here](FUNCTION_DECL.md) for more details
