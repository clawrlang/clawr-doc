<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Clawr Intermediate Representation : Declarations

Declarations are added to the top scope of a module in the `ClawrModule.declarations` array. Declarations may define types, functions or global variables. The order in which they appear is of some importance (see the rules below). As a rule of thumb, entities must be declared prior to any declarations that reference them.

```ts
type Declaration = (
  | VariableDeclaration
  | FunctionDeclaration
  | TypeDeclaration
) & { namespace?: string }

type ClawrModule = {
  $schema: 'http://clawr.lang/schema/cir/DRAFT-0'
  startBlock?: Statement[]
  declarations?: Declaration[]
}
```

This document lists all declarations and their content.

## `RC_TYPE_DECL`

```ts
type TypeDeclaration = {
  kind: 'RC_TYPE_DECL'
  name: string
  fields: {
    name: string
    valueSet: ValueSet
  }[]
} & (
  | {
      base?: CanonicalName
      methods: FunctionDeclaration[]
      initializers?: Omit<FunctionDeclaration, 'resultValueSet'>[]
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

The `RC_TYPE_DECL` defines a type that stores its internal data in fields. The type might include `methods` for interactions. Clawr separates these types in three variants: `data`, `object` and `service`, with varying structural rules. That distinction is irrelevant to the runtime and lowering, so it is not reflected in the CIR.

The `base` property indicates the direct supertype in an inheritance structure. The structure `MAY` be arbitrarily long by each ancestor including a `base` reference to the next supertype.

The `dispatchTable` array lists polymorphic methods by their method signature (`slot`). These methods `MAY` be called directly or through a dispatch process that selects a different implementation depending on which instance is called. See the [`CALL`](#CALL) node for details regarding invocation. The `declaredIn` property references the earliest ancestor type that first declared the slot. The `implementedBy` property references the type that defines the implementation used by the current type.

### Rules for Frontend

- `RC_TYPE_DECL declarations `MAY` include cyclic references inside a module.
- They `MUST NOT` cause cyclic references between modules.
  - **_TODO_** Should that only be between libraries/packages? Packages should never be allowed to form cycles anyway so it may be a moot rule in that case.
- The `initializers` are methods that are called when the type is used as a supertype. When allocated/instantiated, the subtype `MUST` always call an initializer from the supertype, after initializing all its own fields.
- Each `RC_TYPE_DECL` `MUST` have a unique `name` in its scope (i.e. unique when including the optional `namespace`). That uniqueness includes variables and functions.
- The `dispatchTable` of a subtype `MUST` include entries with the same `slot` values as defined by its supertype in the same order before adding new entries.
- The `declaredIn` and `implementedBy` properties of the `dispatchTable` `MUST` each refer to either the type itself or a type accessible through the `base` property. That type `MUST` include a method with the same signature as the corresponding `slot`.
- The `fields` of a supertype/ancestor `MAY` repeat the same name(s) as the `fields` of a subtype/descendant.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

### Rules for Backend

- The bodies of methods and initializers `MUST` all have access to an implicit variable `self` that has the declared type as its type.
- The `self` variable `MUST` always refer to the same instance as the `receiver` expression of each `CALL` to said method.
- Initializers officially have no return-value, but the backend `MAY` employ the fluent pattern (`return self`) to simplify lowering.
- The `fields` of all types in the inheritance hierarchy `MUST` be allocated as separate memory addresses without overlap. The methods accessing the fields `MUST` be able to reference the same property regardless where in the hierarchy they are.
- The backend `MUST` allow repeated field names in the inheritance structure without conflating them.
- `SHARED` `fields` `MUST` be implemented as pointers to separately reference-counted memory allocations.
- `ISOLATED` `fields` `MAY` be implemented as pointers to separately reference-counted allocations OR be inlined in their parent container. If inlined, they `MUST NOT` include a separate reference count, and `RETAIN`/`RELEASE` nodes that reference them `MUST` be discarded.

## `VARIABLE_DECL`

```ts
type VariableDeclaration = {
  kind: 'VARIABLE_DECL'
  name: string
  valueSet: ValueSet
  initialValue: Expression
}
```

A `VARIABLE_DECL` defines a variable. Variables store values as the application runs. Some variables (“constants”) remain unchanged from inception until destruction. Others are updated frequently. `VARIABLE_DECL` `MAY` be used as a statement (a local variable in a function) or as a module-level declaration (available to all code in the module and — through a namespace reference — to the entire application).

The `valueSet` property identifies the type of the variable. Its intent is to help the backend declare an appropriate storage type for lowering.

### Rules for Frontend

- A `VARIABLE_DECL` that reference a type `MUST` appear after the corresponding `RC_TYPE_DECL`.
- If a `VARIABLE_DECL` calls a function for its initial value, the `FUNCTION_DECL` `MUST` appear before it in the module `declarations` array.
- Each `VARIABLE_DECL` `MUST` have a unique `name` in its scope (i.e. unique when including the optional `namespace`). That uniqueness includes types and functions.
- A local variable `MAY` shadow another variable defined in the parent scope. Shadowed variables become effectively inaccessible as if replaced by their shadows. But when the shadowing scope is exited, the shadowed variables are once again there.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

### Rules for Backend

- All module-scope variables `MUST` be initialized before executing any statements that depend on them.
- Global variables in an executable `MUST` be initialized before the `startBody` statements are executed.
- Global variables in a library `MUST` be initialized before any (other) library code is executed.
- The `initialValue` is an expression that `MUST` be called and assigned to the variable when it is declared. The backend `MAY` serialise the value as machine code data if it is simple enough.
- The backend `MAY` optimize the storage of the variable if its possible values are small enough, but it `MUST` use a storage size that can fit all possible values as declared by the `valueSet` (as long as there is enough available memory). An unconstrained `integer` for example will need arbitrary precision, while an `integer` with `max` and `min` values might fit inside a `uint64_t` (C type), or even a single `byte`.

> [!note]
>
> Mutability and `const`ness are presumed to be inconsequential to the process of lowering. Immutability is enforced by the frontend and not a concern for the backend. All variables `MUST` be lowered in a way that allows mutation.

> [!tip]
> If lowering via C, the backend might use `__attribute__((constructor))` to initialize module-level variables in executables, and use guarded `static` variables for libraries.

## `FUNCTION_DECL`

```ts
type FunctionDeclaration = {
  kind: 'FUNCTION_DECL'
  body: Statement[]
} & FunctionSignature

type FunctionSignature = {
  baseName: string
  labels: string[]
  parameters: {
    name: string
    valueSet: ValueSet
  }[]
  resultValueSet?: ValueSet
}
```

A `FUNCTION_DECL` defines a “free function” in the module, a “static” `companion` method, or a method on an `object`/`service` type. A function's unique name is defined by its `baseName` and its labels (plus the optional `namespace` that exists on all declarations).

In the source code, each parameter is defined by an optional label. In the CIR, those `labels` are considered part of the function name.

The `name` is how the parameter is referenced in the function body, and the `valueSet` identifies the type of the variable. It is a `ValueSet` — not a simple type name — to allow the backend to make custom storage optimisation.

The `resultValueSet` — like parameter value-sets — is a hint to allow the backend to lower the function definition with an appropriate storage type. An `undefined`/`null` `resultValueSet` indicates that the function returns no result (`void` in C-like languages).

### Rules for Frontend

- A `FUNCTION_DECL` that reference a type `MUST` appear after the corresponding `RC_TYPE_DECL`.
- The `labels` array `MUST` have at most the same number of items as the `parameters`.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

### Rules for Backend

- The `body` statements `MUST` be executed in the order they appear or in an order that is semantically equivalent.
- For the sake of optimization, the `body` statements `MAY` be executed in a different order than they appear, provided that the semantic meaning is not affected.
- When mangling a function name, the backend `MUST` use a naming scheme that includes all labels, but is unlikely to cause collisions with programmer-defined names. The backend `MAY` use the cedilla (`¸`) character to separate labels from each other, and from the `baseName`. The frontend `MUST` forbid that character in Clawr identifiers.
