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
export type ClawrModule = {
  $schema: 'http://clawr.lang/schema/cir/DRAFT-0'
  startBlock?: Statement[]
  declarations?: Declaration[]
}
```

A _module_ is a single .clawr source code file. The file `MAY` contain a single `@main {}` block for running the program. The frontend `MUST` add this block as `startBlock` in the CIR.

- The `startBlock` statements `MUST` go into the block of an `int main() {}` function (if lowering though C) or whatever equivalent the backend uses for the same purpose.
- In a multi-module project there `MUST NOT` be more than one `startBlock` in total.
- An executable product `MUST` contain a `startBlock`. If the programmer does not define one, the frontend `MUST` exit with an error status.
- A library product `MAY` define a `startBlock`, but it `MUST` be ignored by the backend.

Example:

```json
{
  "startBlock": [
    {
      "type": "EXEC",
      "name": {
        "baseName": "foo",
        "labels": ["x"]
      },
      "arguments": [{ "kind": "INTEGER_LITERAL", "value": "42" }]
    }
  ]
}
```

## Declarations

```ts
export type Declaration =
  | VariableDeclaration
  | FunctionDeclaration
  | DataDeclaration
```

Declarations are added to the top scope of a module in the `ClawrModule.declarations` array. Declarations may define types, functions or global variables. The order in which they appear is important. Referenced entities `MUST` exist prior to the reference is made.

`VARIABLE_DECL` and `FUNCTION_DECL` declarations that reference a declared type `MUST` appear after the corresponding `DATA_DECL`. If a variable calls a function for its initial value, the `FUNCTION_DECL` `MUST` appear before the `VARIABLE_DECL`.

### `DATA_DECL`

```ts
type DataDeclaration = {
  kind: 'DATA_DECL'
  name: string
  fields: {
    name: string
    valueSet: ValueSet
  }[]
}
```

The `DATA_DECL` defines a type that stores its internal data in fields.

### `VARIABLE_DECL`

```ts
type VariableDeclaration = {
  kind: 'VARIABLE_DECL'
  name: string
  valueSet: ValueSet
  initialValue: Expression
}
```

A `VARIABLE_DECL` defines a variable. Variables store values as the application runs. Some variables (“constants”) are from inception until destruction. Others are updated frequently.

Each variable has a unique `name` in its scope. A variable `MAY` shadow another variable defined in the parent scope. Shadowed variables become effectively inaccessible until the shadowing scope is destroyed.

The `initialValue` is an expression thet `MUST` be called and assigned to the variable when it is declared. The backend `MAY` serialise the value as machine code data if it is simple enough.

The `valueSet` property identifies the type of the variable. Its intent is to help the backend optimise storage for the variable. The backend `MAY` eschew optimisation, but it `MUST` use a storage size that can fit all possible values as declared by the `valueSet` (as long as there is enough available memory). An unconstrained `integer` for example will need arbitrary precision, while an `integer` with `max` and `min` values might fit inside a `uint64_t` (C type), or even a single `byte`.

> [!note]
> Mutability and `const`ness is presumed to be inconsequential to the process of lowering. It is enforced by the frontend and not a concern for the backend. All variables `MUST` be lowered allowing mutation.

### `FUNCTION_DECL`

```ts
type FunctionDeclaration = {
  kind: 'FUNCTION_DECL'
  baseName: string
  parameters: {
    label?: string
    varName: string
    valueSet: ValueSet
  }[]
  body: Statement[]
  resultValueSet?: ValueSet
}
```

A `FUNCTION_DECL` defines a “free function” in the module. A function's unique name is defined by its `baseName` and parameter labels.

Each parameter is defined by an optional `label`, an internal `varName` and a `valueSet`. The `label` is used when calling the function and considered part of the function name. The `varName` is how the parameter is referenced in the function body, and the `valueSet` identifies the type of the variable. It is a `ValueSet` — not a simple type name — to allow the backend to make custom storage optimisation.

The `returnValueSet` — like parameter value-sets — is a hint to allow the backend to lower the function definition with optimisations. An `undefined` `returnValueSet` indicates that the function returns no result (`void` in C-like languages).

The function has a `body`, which is a sequence of statements. The backend `MUST` lower these statements in order. An optimisation step `MAY` be injected before lowering. That step `MAY` move (or even remove) reference-counting statements as long as it can be done non-destructively.

When mangling a function name, the backend `MUST` use a naming scheme that includes all labels, but is unlikely to cause collisions with programmer-defined names. The backend `MAY` use the `¸` character to separate labels from each other, and from the `baseName`. The frontend `MUST` forbid that character in Clawr identifiers.

## Statements

```ts
export type Statement =
  | EnsureUnique
  | Release
  | Exec
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

An `ENSURE_UNIQUE` statement is injected to preserve isolation between copy-on-write variables and fields. When assigning a variable/field to another, the value does not need to be copied immediately. Aliasing is allowed. When one of the references is modified however, it `MUST` be relocated before change is applied.

- If the reference-count of the `object` is greater than one, a copy must be made
- The variable/field indicated by the `object` property must be changed to reference the new allocation
- The new allocation `MUST` have a reference count of exactly 1
- The reference count of the old value `MUST` be decremented by exactly 1

### `RELEASE`

```ts
type Release = {
  kind: 'RELEASE'
  object: Storage
}

type Storage = VariableReference | FieldReference
```

The `RELEASE` statement decrements the reference count of a block of memory.

- The reference count of the `object` must be decremented by exactly 1
- If the reference count reaches 0, the `object` `MUST` be deallocated.
- `MUST` allow `RELEASE(null)` without crashing
- `MAY` assign `null` to the variable/field to avoid zombie dereferencing

### `EXEC`

```ts
type Exec = {
  kind: 'EXEC'
  name: {
    baseName: string
    labels: string[]
  }
  arguments: Expression[]
}
```

A Clawr function may or may not have a return value. A function without a return value can only be called as a statement/command. A function with a return value can only be called as an expression. The `EXEC` statement `MUST NOT` be `ASSIGN`ed to a variable of field, or used as an argument in another `EXEC` statement or a `QUERY` expression.

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
export type Expression =
  | StringLiteral
  | IntegerLiteral
  | TruthLiteral
  | MemoryAllocation
  | MemoryRetention
  | AsShared
  | VariableReference
  | FieldReference
  | QueryFunctionCall
```

`Expression`s are used as arguments for `Statement`s and other `Expression`s.

### `STRING_LITERAL`

```ts
type StringLiteral = {
  kind: 'STRING_LITERAL'
  value: string
  valueSet: StringValueSet
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
  valueSet: IntegerValueSet
}
```

An `INTEGER_LITERAL` is a simple integer value. It may be arbitrarily large. The `valueSet` `MUST` include `min` and `max` properties, and they `MUST` equal the `value` property.

The `value` is the decimal representation of the integer value. It is a string because the value may be arbitrarily large and JSON parsers do not generally support arbitrarily large integers.

### `TRUTHVALUE_LITERAL`

```ts
type TruthLiteral = {
  kind: 'TRUTHVALUE_LITERAL'
  value: 'false' | 'ambiguous' | 'true'
  valueSet: TruthValueSet
}
```

A `TRUTHVALUE_LITERAL` is a simple truth value. The `valueSet.values` property `MUST` contain a single value, and that value `MUST` equal the `value` property.

The `value` can be either of `"false"`, `"ambiguous"` or `"true"`. The backend `MUST` treat these values as zzzseparate and mutually unequal.

### `QUERY`

```ts
type QueryFunctionCall = {
  kind: 'QUERY'
  name: {
    baseName: string
    labels: string[]
  }
  arguments: Expression[]
  valueSet: ValueSet
}
```

A Clawr function may or may not have a return value. A function _without_ a return value can only be called as a statement (`EXEC`). A function _with_ a return value can only be called as an expression. The `QUERY` expression `MUST` be `ASSIGN`ed to a variable of field, or used as an argument in another `QUERY` expression or statement.

- The name `MUST` be mangled using the same naming scheme as `FUNCTION_DECL` uses.
- The indicated function `MUST` be called with the specified arguments matching the parameters of the function in declared order.

### `ALLOCATE`

```ts
type MemoryAllocation = {
  kind: 'ALLOCATE'
  valueSet: RcTypeValueSet
  fields: {
    name: string
    value: Expression
  }[]
}
```

Allocate memory for a reference-counted entity. The `valueSet` `MUST` name a reference-counted type (`rc-type`) in its `typeName` property.

The backend `MUST` allocate enough memory to store the entire entity, plus whatever additional information it needs for reference counting and other runtime checks.

The `semantics` property in included as a courtesy. The backend `MAY` use the information to aid optimisation. If the value is `"ISOLATED"` the backend `MAY` use stack allocation instead of heap allocation. But then it `MUST` dereference `ISOLATED` values accordingly in other expressions.

The `fields` property indicates the initial value of the allocated memory. The reference-counted `type` `MUST` have fields to maintain its state (whether those fields are considered private or public). The backend `MUST` populate each field with the value of the corresponding `Expression`.

### `RETAIN`

```ts
type MemoryRetention = {
  kind: 'RETAIN'
  object: Storage
  valueSet: RcTypeValueSet
}
```

Increment the reference count of an allocation. The reference count of the `object` `MUST` be increased by exactly one.

### `AS_SHARED`

```ts
type AsShared = {
  kind: 'AS_SHARED'
  object: QueryFunctionCall
  targetSemantics: 'SHARED' | 'ISOLATED'
  valueSet: RcTypeValueSet
}
```

Upgrades an `ISOLATED` value to a `SHARED` entity. The reference count of the `object` value `MUST` be exactly 1.

The backend `MAY` create a copy of the value or modify an isolation flag on the value.

### `VARIABLE_REF`

```ts
type VariableReference = {
  kind: 'VARIABLE_REF'
  name: string
  valueSet: ValueSet
}
```

Reference a variable. The `valueSet` returns the best lattice knowledge of the variable's current value. The variable might be defined as an unconstrained `integer`, but could still be known within a certain range at this point. The backend `MAY` use this information to optimise the lowered statement.

### `FIELD_REF`

```ts
type FieldReference = {
  kind: 'FIELD_REF'
  object: Expression
  field: string
  valueSet: ValueSet
}
```

Reference a field. The `valueSet` returns the best lattice knowledge of the field's current value. The field might be defined as an unconstrained `integer`, but could still be known within a certain range at this point. The backend `MAY` use this information to optimise the lowered statement.

## Value Sets

```ts
export type ValueSet =
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

If either or both limits is excluded, the value is any integer ($\mathbb{Z}$), and the backend `MUST` use arbitrary precision to store the value. If both limits are set, the backend `MAY` use an optimised storage type for the value.

### `real`

```ts
type RealValueSet = {
  type: 'real'
  min?: string // numeric, can be arbitrarity big
  max?: string // numeric, can be arbitrarity big
}
```

A range of real values. A constant integer (e.g. a `const` variable or a literal) will have `min` = `max`, equal to the constant itself. Other value-sets may skip either the `min`, `max` or both properties.

If either or both limits is excluded, the value could be any real number ($\mathbb{R}$), and the backend `MUST` use arbitrary precision to store the value. If both limits are set, the backend `MAY` use an optimised storage type for the value.

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
  typeName: string
  semantics: 'SHARED' | 'ISOLATED'
}
```

A set allowing all instances of a reference counted type (including inheritance). The `typeName` `MUST` identify a type that is available in the current scope.

The `semantics` property identifies whether the value is a `SHARED` entity or meant for `ISOLATED` variables.
