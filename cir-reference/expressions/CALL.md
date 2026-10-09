<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">
# `CALL`

[CIR](../README.md) : [Expressions](./README.md)

A Clawr function may or may not have a return value. A `CALL` structure can be used as an expression or a statement. A `CALL` used as an _expression_ always references a function _with_ a `domain`.

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
  domain: ValueSet
}

type Receiver =
  | {
      object: Expression & { domain: RCTypeSet | InterfaceSet }
      dispatch: 'direct'
    }
  | {
      object: Expression & { domain: RCTypeSet }
      dispatch: 'inherited'
    }
  | {
      object: Expression & { domain: InterfaceDeclaration }
      dispatch: 'conformance'
    }

type Storage =
  | Omit<VariableReference, 'domain'>
  | Omit<PropertyReference, 'domain'>
```

The `receiver` property — if specified — indicates that the called function is a method and the `self` of the call is the receiver.

The `name` property indicates the `baseName` and `labels` of the called function. Two functions in the same `namespace` — or two methods on the same `object` — `MAY` have the same `baseName` if they have a differently named `labels`.

The `arguments` property lists the values sent to the function parameters.

The `dispatch` property of the `receiver` indicate how the method is called: directly or dynamically.

## Rules for Frontend

- At least one of `namespace` or `receiver` `MUST` be `undefined`/`null`.
- If the called function exists in a `namespace` or a `companion`, that `MUST` be named in the `namespace` property.
- The called function `MUST NOT` have a `void` return type
- The `CALL` expression `MUST` be `ASSIGN`ed to a variable of property, or used as an argument in another `CALL` expression or statement.
- The `value` `MUST` be a subset of the function’s declared domain.

## Rules for Backend

- The name `MUST` be mangled using the same naming scheme as `FUNCTION_DECL` uses.
- The indicated function `MUST` be called with the specified arguments matching the parameters of the function in declared order.
- If calling a method, the `receiver` expression `MUST` evaluate to the `object` or `service` the message is sent to.
- Any `VARIABLE_REF` using the reserved name `"self"` in the body of the method `MUST` evaluate to the `receiver` of the `CALL`.
