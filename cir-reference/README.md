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

```ts
type ClawrModule = {
  $schema: 'http://clawr.lang/schema/cir/DRAFT-0'
  startBlock?: Statement[]
  declarations?: Declaration[]
}
```

A _module_ is a single .clawr code file. The file `MAY` contain a single `@main {}` block for running the program. The frontend `MUST` add this block as `startBlock` in the CIR.

### Example

```json
{
  "startBlock": [
    {
      "type": "EXEC",
      "name": {
        "baseName": "print",
        "labels": []
      },
      "arguments": [{ "kind": "INTEGER_LITERAL", "value": "42" }]
    }
  ]
}
```

### Rules for Frontend

- A module `MAY` include zero or one `startBlock` nodes.
- There `MUST` be no more than one `startBlock` in the entire application, even in a multi-module project. If there are multiple `@main` blocks in the source code, the frontend `MUST` exit with an error status.
- An executable product `MUST` contain a `startBlock`. If the programmer does not define a `@main` block, the frontend `MUST` exit with an error status.
- A library (non-executable) product `MUST NOT` define a `startBlock`. The frontend `MAY` allow a `@main` block in the source code, but in such case it `MUST NOT` propagate to the CIR.

### Rules for Backend

- The `startBlock` statements `MUST` go into the block of an `int main() {}` function (if lowering though C) or whatever equivalent the backend uses for the same purpose.
- Module-level variables `MUST` be initialized before executing any statements that depend on them.
- For the sake of optimization, the `startBlock` statements `MAY` be executed in a different order than they appear, provided that the semantic meaning is not affected.

## Declarations

```ts
type Declaration = { namespace?: string } & (
  | VariableDeclaration
  | FunctionDeclaration
  | TypeDeclaration
)
```

Declarations are added to the top scope of a module in the `ClawrModule.declarations` array. Declarations may define types, functions or global variables. The order in which they appear is of some importance (see the rules below). Referenced entities must generally be declared prior to the declarations that reference them.

### `TYPE_DECL`

```ts
type TypeDeclaration = {
  // `data` only supports these
  kind: 'TYPE_DECL'
  name: string
  fields: {
    name: string
    valueSet: ValueSet
  }[]
} & ( // `object`/`service` add methods and optional inheritance
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

The `TYPE_DECL` defines a type that stores its internal data in fields. The type might include `methods` for interactions. Clawr separates these types in three variants: `data`, `object` and `service`, with varying structural rules. That distinction is irrelevant to the runtime and lowering, so it is not reflected in the CIR.

The `base` property indicates the direct supertype in an inheritance structure. The structure `MAY` be arbitrarily long by each ancestor including a `base` reference to the next supertype.

The `dispatchTable` array lists polymorphic methods by their method signature (`slot`). These methods `MAY` be called directly or through a dispatch process that selects a different implementation depending on which instance is called. See the [`CALL`](#CALL) node for details regarding invocation. The `declaredIn` property references the earliest ancestor type that first declared the slot. The `implementedBy` property references the type that defines the implementation used by the current type.

#### Rules for Frontend

- `TYPE_DECL declarations `MAY` include cyclic references inside a module.
- They `MUST NOT` cause cyclic references between modules.
    - **_TODO_** Should that only be between libraries/packages? Packages should never be allowed to form cycles anyway so it may be a moot rule in that case.
- The `initializers` are methods that are called when the type is used as a supertype. When allocated/instantiated, the subtype `MUST` always call an initializer from the supertype, after initializing all its own fields.
- Each `TYPE_DECL` `MUST` have a unique `name` in its scope (i.e. unique when including the optional `namespace`). That uniqueness includes variables and functions.
- The `dispatchTable` of a subtype `MUST` include entries with the same `slot` values as defined by its supertype in the same order before adding new entries.
- The `declaredIn` and `implementedBy` properties of the `dispatchTable` `MUST` each refer to either the type itself or a type accessible through the `base` property. That type `MUST` include a method with the same signature as the corresponding `slot`.
- The `fields` of a supertype/ancestor `MAY` repeat the same name(s) as the `fields` of a subtype/descendant.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

#### Rules for Backend

- The bodies of methods and initializers `MUST` all have access to an implicit variable `self` that has the declared type as its type.
- The `self` variable `MUST` always refer to the same instance as the `receiver` expression of each `CALL` to said method.
- Initializers officially have no return-value, but the backend `MAY` employ the fluent pattern (`return self`) to simplify lowering.
- The `fields` of all types in the inheritance hierarchy `MUST` be allocated as separate memory addresses without overlap. The methods accessing the fields `MUST` be able to reference the same property regardless where in the hierarchy they are.
- The backend `MUST` allow repeated field names in the inheritance structure without conflating them.
- `SHARED` `fields` `MUST` be implemented as pointers to separately reference-counted memory allocations.
- `ISOLATED` `fields` `MAY` be implemented as pointers to separately reference-counted allocations OR be inlined in their parent container. If inlined, they `MUST NOT` include a separate reference count, and `RETAIN`/`RELEASE` nodes that reference them `MUST` be discarded.

### `VARIABLE_DECL`

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

#### Rules for Frontend

- A `VARIABLE_DECL` that reference a type `MUST` appear after the corresponding `TYPE_DECL`.
- If a `VARIABLE_DECL` calls a function for its initial value, the `FUNCTION_DECL` `MUST` appear before it in the module `declarations` array.
- Each `VARIABLE_DECL` `MUST` have a unique `name` in its scope (i.e. unique when including the optional `namespace`). That uniqueness includes types and functions.
- A local variable `MAY` shadow another variable defined in the parent scope. Shadowed variables become effectively inaccessible as if replaced by their shadows. But when the shadowing scope is exited, the shadowed variables are once again there.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

#### Rules for Backend

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

### `FUNCTION_DECL`

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

#### Rules for Frontend

- A `FUNCTION_DECL` that reference a type `MUST` appear after the corresponding `TYPE_DECL`.
- The `labels` array `MUST` have at most the same number of items as the `parameters`.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

#### Rules for Backend

- The `body` statements `MUST` be executed in the order they appear or in an order that is semantically equivalent.
- For the sake of optimization, the `body` statements `MAY` be executed in a different order than they appear, provided that the semantic meaning is not affected.
- When mangling a function name, the backend `MUST` use a naming scheme that includes all labels, but is unlikely to cause collisions with programmer-defined names. The backend `MAY` use the cedilla (`¸`) character to separate labels from each other, and from the `baseName`. The frontend `MUST` forbid that character in Clawr identifiers.

## Statements

```ts
type Statement =
  | EnsureUnique
  | Release
  | FunctionCall
  | Return
  | VariableDeclaration
  | Assign
```

Statements are added to the `startBlock` of a module, and to the `body` of a function. Statements `MUST NOT` be reordered or skipped when lowering. An optimisation step `MAY` however perform limited changes.

### `ENSURE_UNIQUE`

```ts
type EnsureUnique = {
  kind: 'ENSURE_UNIQUE'
  object: Storage
}

type Storage = VariableReference | FieldReference
```

An `ENSURE_UNIQUE` statement is injected to preserve isolation between copy-on-write variables and fields. When assigning a variable/field to another, the value does not need to be copied immediately. Aliasing is allowed. When one of the references is modified however, it `MUST` be relocated (using `ENSURE_UNIQUE`) before the change is applied.

#### Rules for Frontend

- The operation `MUST` be injected before editing an `ISOLATED` referenced-counted variable or field.
- The operation `MUST NOT` be injected for `SHARED` values.
- The operation `MUST NOT` be injected for non-reference-counted values.
- The operation `MAY` be elided/removed by optimization if the reference count is already provably 1 (e.g. if `ENSURE_UNIQUE` has already been performed due to a previous mutation).

#### Rules for Backend

- If the reference-count of the `object` is greater than one, a copy `MUST` be made.
- If the reference-count is exactly one, copying `MUST NOT` be made.
- The variable/field indicated by the `object` property `MUST` be relocated to reference the new allocation.
- The new allocation `MUST` have a reference count of exactly 1.
- The reference count of the original allocation `MUST` be decremented by exactly 1.

### `RELEASE`

```ts
type Release = {
  kind: 'RELEASE'
  object: Storage
}

type Storage = VariableReference | FieldReference
```

The `RELEASE` statement decrements the reference count of a block of memory.

- The reference count of the `object` must be decremented by exactly 1.
- If the reference count reaches 0, the `object` `MUST` be deallocated.
- The backend/runtime `MUST` allow `RELEASE(null)` without crashing.
- The backend `MAY` assign `null` to the variable/field to avoid zombie references.

If the runtime is implemented using stack-allocated values for `ISOLATED` variables, this instruction may be disregarded. (Would that require including the semantics as a property?)

### `CALL`

```ts
type FunctionCall = {
  kind: 'CALL'
  receiver?: Receiver
  name: {
    namespace?: string
    baseName: string
    labels: string[]
  }
  arguments: Expression[]
}

type Receiver = {
  object: Storage
} & (
  | {
      dispatch: 'direct'
      type: CanonicalName
    }
  | {
      dispatch: 'inherited'
      declaredIn: CanonicalName
    }
)

type CanonicalName = { name: string; namespace?: string }
type Storage = VariableReference | FieldReference
```

A Clawr function may or may not have a return value. A function without a return value can only be called as a statement/command. A function with a return value `MUST` only be called as an expression.

If calling a method, the `receiver` expression `MUST` evaluate to the `object` or `service` the message is sent to. If the called function exists in a `namespace` or a `companion`, that is the `namespace` property. Any `VARIABLE_REF` using the reserved name `"self"` in the body of the method `MUST` evaluate to the `receiver` of the `CALL`.

- At least one of `namespace` or `receiver` `MUST` be `undefined`/`null`.
- The name `MUST` be mangled using the same naming scheme as `FUNCTION_DECL` uses.
- The indicated function `MUST` be called with the specified arguments matching the parameters of the function in declared order.

### `RETURN`

```ts
type Return = {
  kind: 'RETURN'
  value?: Expression
}
```

Return early from a `void` function or return a value from a query function.

### `ASSIGN`

```ts
type Assign = {
  kind: 'ASSIGN'
  target: Storage
  value: Expression
}

type Storage = VariableReference | FieldReference
```

Assign a value to a variable or a field.

### `VARIABLE_DECL`

```ts
type VariableDeclaration = {
  kind: 'VARIABLE_DECL'
  name: string
  valueSet: ValueSet
  initialValue: Expression
}
```

The variable declaration can also be used as a `Statement`. In other words, it `MAY` appear in a function body and in the `startBlock` of a module.

## Expressions

```ts
type Expression =
  | StringLiteral
  | IntegerLiteral
  | TruthLiteral
  | MemoryAllocation
  | MemoryRetention
  | AsShared
  | VariableReference
  | FieldReference
  | FunctionCall
```

`Expression`s are used as arguments in `Statement`s and other `Expression`s.

### `STRING_LITERAL`

```ts
type StringLiteral = {
  kind: 'STRING_LITERAL'
  value: string
}
```

A `STRING_LITERAL` is a simple textual value. The backend `MAY` lower this as a simple string if it can avoid dereferencing it as a zombie. It also `MAY` add reference counting or other mechanisms to ensure that the value is deallocated when no longer used.

The `value` of the literal string is included.

The `valueSet` simply identifies the literal value as a `string` (which the `kind` also does).

### `INTEGER_LITERAL`

```ts
type IntegerLiteral = {
  kind: 'INTEGER_LITERAL'
  value: string
}
```

An `INTEGER_LITERAL` is a simple integer value. It may be arbitrarily large. The `valueSet` `MUST` include `min` and `max` properties, and they `MUST` equal the `value` property.

The `value` is the decimal representation of the integer value. It is a string because the value may be arbitrarily large and JSON parsers do not generally support arbitrarily large integers.

### `TRUTHVALUE_LITERAL`

```ts
type TruthLiteral = {
  kind: 'TRUTHVALUE_LITERAL'
  value: 'false' | 'ambiguous' | 'true'
}
```

A `TRUTHVALUE_LITERAL` is a simple truth value. The `valueSet.values` property `MUST` contain a single value, and that value `MUST` equal the `value` property.

The `value` can be either of `"false"`, `"ambiguous"` or `"true"`. The backend `MUST` treat these values as separate and mutually unequal.

### `CALL`

```ts
type FunctionCall = {
  kind: 'CALL'
  receiver?: Receiver
  name: {
    namespace?: string
    baseName: string
    labels: string[]
  }
  arguments: Expression[]
}

type Receiver = {
  object: Storage
} & (
  | {
      dispatch: 'direct'
      type: CanonicalName
    }
  | {
      dispatch: 'inherited'
      declaredIn: CanonicalName
    }
)

type Storage = VariableReference | FieldReference
```

A Clawr function may or may not have a return value. A function _without_ a return value can only be called as a statement. A function _with_ a return value can only be called as an expression. The `CALL` expression `MUST` be `ASSIGN`ed to a variable of field, or used as an argument in another `CALL` expression or statement.

If calling a method, the `receiver` expression `MUST` evaluate to the `object` or `service` the message is sent to. If the called function exists in a `namespace` or a `companion`, that is the `namespace` property. Any `VARIABLE_REF` using the reserved name `"self"` in the body of the method `MUST` evaluate to the `receiver` of the `CALL`.

- At least one of `namespace` or `receiver` `MUST` be `undefined`/`null`.
- The name `MUST` be mangled using the same naming scheme as `FUNCTION_DECL` uses.
- The indicated function `MUST` be called with the specified arguments matching the parameters of the function in declared order.

### `ALLOCATION`

```ts
type MemoryAllocation = {
  kind: 'ALLOCATION'
  type: CanonicalName
  base?: CanonicalName
  isolationLevel: IsolationLevel
  fields: {
    name: string
    value: Expression
  }[]
}

type CanonicalName = { name: string; namespace?: string }
type IsolationLevel = 'ISOLATED' | 'SHARED'
```

Allocate memory for a reference-counted entity. The `valueSet` `MUST` name a reference-counted type (`rc-type`) in its `type` property.

The backend `MUST` allocate enough memory to store the entire entity, plus whatever additional information it needs for reference counting and other runtime checks.

The `semantics` property in included as a courtesy. The backend `MAY` use the information to aid optimisation. If the value is `"ISOLATED"` the backend `MAY` use stack allocation instead of heap allocation. But then it `MUST` dereference `ISOLATED` values accordingly in other expressions.

The `fields` property indicates the initial value of the allocated memory. The reference-counted `type` `MUST` have fields to maintain its state (whether those fields are considered private or public). The backend `MUST` populate each field with the value of the corresponding `Expression`.

### `RETAIN`

```ts
type MemoryRetention = {
  kind: 'RETAIN'
  object: Storage
}

type Storage = VariableReference | FieldReference
```

Increment the reference count of an allocation. The reference count of the `object` `MUST` be increased by exactly one.

If the runtime is implemented using stack-allocated values for `ISOLATED` variables, this instruction may be disregarded. (Would that require including the semantics as a property?)

### `AS_SHARED`

```ts
type AsShared = {
  kind: 'AS_SHARED'
  object: FunctionCall
}
```

Upgrades a uniquely referenced `ISOLATED` value to a `SHARED` entity. The reference count of the `object` value `MUST` be exactly 1.

The backend `MAY` create a copy of the value or just modify an isolation flag on the value.

If the function call is `copy(of:)`, the backend `MAY` optimize the entire structure into passing a flag and 

The backend `MAY` collapse the structure and pass a flag into the function implementation instead. But in that case, it `MUST` pass the equivalent of `ISOLATED` to that function whenever the `AS_SHARED` structure does not wrap the call.

The backend `MAY` ignore the wrapper entirely if it does not track isolation-levels for allocations. But it `MUST` still call the wrapped funtion.

### `VARIABLE_REF`

```ts
type VariableReference = {
  kind: 'VARIABLE_REF'
  name: string
}
```

The runtime value of a variable. The `valueSet` returns the best lattice knowledge of the variable's current value. The variable might be defined as an unconstrained `integer`, but could still be known within a certain range at this point. The backend `MAY` use this information to optimise the lowered statement.

### `FIELD_REF`

```ts
type FieldReference = {
  kind: 'FIELD_REF'
  object: Expression
  field: string
}
```

The runtime value of a field. The `valueSet` returns the best lattice knowledge of the field's current value. The field might be defined as an unconstrained `integer`, but could still be known within a certain range at this point. The backend `MAY` use this information to optimise the lowered statement.

## Value Sets

```ts
type ValueSet =
  | IntegerValueSet
  | RealValueSet
  | TruthValueSet
  | StringValueSet
  | RcTypeValueSet
```

Every expression has a `valueSet` that encompasses all possible runtime values of the given expression in its position in the code. Variables, fields and parameters also have a value-set. that constrains what values may be stored in the respective container.

### `integer`

```ts
type IntegerValueSet = {
  type: 'integer'
  min?: string
  max?: string
}
```

A range of integer values. A constant integer (e.g. a `const` variable or a literal) will have `min` = `max`, equal to the constant itself. Other value-sets may skip either the `min`, `max` or both properties.

If either or both limits is excluded, the value is any integer (ℤ), and the backend `MUST` use arbitrary precision to store the value. If both limits are set, the backend `MAY` use an optimised storage type for the value.

### `real`

```ts
type RealValueSet = {
  type: 'real'
  min?: string // numeric, can be arbitrarity big
  max?: string // numeric, can be arbitrarity big
}
```

A range of real values. A constant integer (e.g. a `const` variable or a literal) will have `min` = `max`, equal to the constant itself. Other value-sets may skip either the `min`, `max` or both properties.

If either or both limits is excluded, the value could be any real number (ℝ), and the backend `MUST` use arbitrary precision to store the value. If both limits are set, the backend `MAY` use an optimised storage type for the value.

### `truthvalue`

```ts
type TruthValueSet = {
  type: 'truthvalue'
  values: ('false' | 'ambiguous' | 'true')[]
}
```

A set of truth values.

### `string`

```ts
type StringValueSet = { type: 'string' }
```

An unconstrained string value.

### Custom `data` Structures

```ts
type RcTypeValueSet = {
  type: 'rc-type'
  namespace?: string
  typeName: string
}
```

A set allowing all instances of a reference counted type (including inheritance). The `typeName` `MUST` identify a type that is available in the current scope.

The `semantics` property identifies whether the value is a `SHARED` entity or meant for `ISOLATED` variables.

<script>
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  }
};
</script>
<script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
</script>
