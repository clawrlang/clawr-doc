<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Statements

[CIR](cir-reference/README.md)

Statements are added to the `startBlock` of a module, and to the `body` of a function. Statements `MUST NOT` be reordered or skipped when lowering. An optimisation step `MAY` however perform limited changes.

## ENSURE_UNIQUE

An [`ENSURE_UNIQUE`](ENSURE_UNIQUE.md) statement is injected by the frontend before mutations to preserve state isolation between copy-on-write variables and fields.

```ts
type EnsureUnique = {
  kind: 'ENSURE_UNIQUE'
  object: Storage
}
```

[Click here](ENSURE_UNIQUE.md) for more details

## `RELEASE`

The [`RELEASE`](./RELEASE) statement decrements the reference count of a block of memory.

```ts
type Release = {
  kind: 'RELEASE'
  object: Storage
}

type Storage = VariableReference | FieldReference
```

[Click here](./RELEASE) for more details

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
