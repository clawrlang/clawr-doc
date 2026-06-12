<!-- markdownlint-disable MD041 MD033 -->
<a href="./users/rawry.md">
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
</a>

# the Semantic Syntax Tree

The Clawr frontend emits a data structure (SST) that formalises the source code. The job of the backend is to faithfully translate its instructions to its own language.

> [!note]
>
> Clawr is a work in progress. This specification is subordinate to the main source code. It tries to be as faithful as possible, but if there are any discrepancies, the source code should be considered the truth: <https://github.com/clawrlang/clawr/blob/development/src/sst/index.ts>

This document uses [IEEE 2119 syntax](https://www.rfc-editor.org/info/rfc2119/) to indicate when the backend `MUST` or `MUST NOT` implement certain behaviour and when it `MAY` choose as it pleases. It also uses `WILL` and `WILL NOT` for equivalent requirements — promises — regarding the input structure.

## Statement Nodes

### VARIABLE_DECLARATION

```ts
export type VariableDeclarationNode = {
    type: 'VARIABLE_DECLARATION'
    name: string
    initializer: ExpressionNode | undefined
}
```

This defines a variable. The variable WILL always has an initial value, an `initializer` expression. That expression might be simple or complex. The backend MAY implement the assignment in any way that fits their lowering strategy. [^initialization]

A new declaration cannot have any additional references, so the construction MAY skip atomicity for writing. The assigned value might however change if the assignment takes long, so the backend MUST ensure atomic read.

- Writing MAY be atomic or nonatomic
- Read MUST be atomic
- The assignment MUST be complete after the operation is done
- If the value is a `DATA_LITERAL`, the value MUST be copied into the assignee allocation
- If the value is complex, but not a literal, the backend MUST reuse the value’s allocation and MUST NOT copy its internals

### ASSIGN

```ts
export type AssignmentNode = {
    type: 'ASSIGN'
    target: ExpressionNode
    value: ExpressionNode
}
```

This assigns the value of an expression to a variable or field. That expression might be simple or complex. The backend MAY implement the assignment in any way that fits their lowering strategy. [^initialization]

[^initialization]: For example (in C) the initial state of a complex structure might be implemented using a local stack-allocated variable and use `memcpy` to copy the entire value to a heap allocation in one step, or it might explicitly assign each field individually.

As both the value and the variable might have multiple references, the backend MUST ensure atomicity for both reading and writing.

- Both read and write MUST be atomic.
- The value of the assignee MUST reflect the assignment `value` after the assignment.
- If the value is a `DATA_LITERAL`, the value MUST be copied into the assignee allocation
- If the value is complex, but not a literal, the backend MUST reuse the value’s allocation and MUST NOT copy its internals
- The backend MUST NOT release the old value. The frontend WILL add the necessary RELEASE statement (which might involve a temporary variable).

### RELEASE

```ts
export type ReleaseNode = {
    type: 'RELEASE'
    value: ExpressionNode
}
```

This indicates that a reference has been reassigned and the value has one less reference. The `value` WILL be a complex, reference counted structure

- The backend MUST decrement the reference count of the indicated value by exactly one
- Reference counting MUST be atomic
- If the reference count reaches 0, the memory allocation MAY be deallocated.
- If the reference count is > 0, the memory allocation MUST NOT be deallocated.
- The backend MAY deallocate the memory immediately or later (or not at all) as befits its optimisation strategies. [^deallocation]
- The backend MUST handle the case when the variable has no value to deallocate (`null`).

[^deallocation]: The memory probably should be freed as soon as possible. But the backend’s optimisation strategy may defer it indefinitely if that is deemed better for performance.

### ENSURE_UNIQUE

> Proposed: Not yet emitted in the SST

```ts
type EnsureUniqueNode = {
    type: 'ENSURE_UNIQUE'
    value: ExpressionNode
}
```

This indicates that the value in question is about to be modified and the referencing variable needs to be isolated. The value WILL be a variable reference or a 

- If the retain count is > 1, the backend MUST create an exact copy of the value
- The value of the expression MUST refer to the new copy
- The copy MUST have a retain count of 1
- The original value MUST decrement its retain count by one
- The referenced variable/field MUST refer to the new value after the operation
- The copy operation MUST be atomic.
- The decrement of the retain count MAY be atomic or nonatomic
- If the retain count decrement is delayed/nonatomic, it might reach zero. In such case the value MUST be deallocated or queued for deallocation

## Expressions

### ALLOCATE

> Proposed: Not yet emitted in the SST

```ts
type AllocateMemoryExpressionNode = {
    type: 'ALLOCATE'
    typeName: string
    semantics: 'ISOLATED' | 'SHARED'
}
```

This instruction allocates memory for assigning to a variable or field. The `typeName` names the allocated type. The type MAY be a simple data structure or it MAY be the subtype of an inheritance chain. The `semantics` field is a hint that indicates the semantics of the assignee.

- The backend MUST allocate enough memory to fit the entire structure (including inherited fields)
- The address of the allocated memory MUST be assigned to the assignee
- The allocated memory MUST have a reference count of exactly 1
- The backend MAY use the semantics hint for optimisation

### RETAIN

```ts
export type RetainExpressionNode = {
    type: 'RETAIN'
    value: ExpressionNode
}
```

Retaining a value means that it is about to be assigned to a variable or a field, or passed as argument to a function or method.

- The backend MUST increment the reference count of the indicated value by exactly one
- Reference counting MUST be atomic

### VARIABLE_REFERENCE

```ts
export type VariableReferenceNode = {
    type: 'VARIABLE_REFERENCE'
    name: string
}
```

This names a variable or function in the current scope.

### DATA_LITERAL

> The `typeName` property might be made redundant — and removed – when/if `ALLOCATE` is added formally.


```ts
export type DataLiteralNode = {
    type: 'DATA_LITERAL'
    typeName: string
    fields: DataFieldNode[]
    initializer?: DataInitializerNode
}

type DataFieldNode = {
    name: string
    value: ExpressionNode
}

type DataInitializerNode = {
    value: ExpressionNode
}
```

The data literal indicates a complex value assigned to a variable, field or function argument. The `initializer` WILL NOT be used unless the expression type is a subtype in an inheritance chain. The `initializer` WILL refer to an inheritance initialiser defined by the immediate supertype only.

- The fields of the assignee MUST reflect the values of the expression after assignment
- If an initialiser is specified, it MUST be executed after the fields have been assigned, but before the assignee is used
- The write MUST be atomic and complete before any other expression referencing the assignee may be evaluated

```ts
export type BinaryOperatorExpressionNode = {
    type: 'BINARY_OPERATOR'
    operator: Operator
    left: ExpressionNode
    right: ExpressionNode
}

export type PrefixOperatorExpressionNode = {
    type: 'PREFIX_OPERATOR'
    operator: Operator
    operand: ExpressionNode
}

export type MemberAccessExpressionNode = {
    type: 'MEMBER_ACCESS'
    object: ExpressionNode
    member: string
}
```

## Literals

```ts
export type LiteralNode =
    | {
          type: 'TRUTHVALUE_LITERAL'
          value: Truthvalue
      }
    | {
          type: 'STRING_LITERAL' | 'INTEGER_LITERAL' | 'REAL_LITERAL'
          value: string
      }
    | {
          type: 'REGEX_LITERAL'
          pattern: string
          flags: string[]
      }
```

