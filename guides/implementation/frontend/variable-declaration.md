# Model Class: `VariableDeclaration`

Clawr Syntax:

```clawr
mut x = 32
const y = x

ref z: Data = {}
mutref w = z
```

CIR definition:

```ts
type VariableDeclaration = {
  kind: 'VARIABLE_DECL'
  name: string
  namespace?: string
  domain: ValueSet
  initialValue: Expression
}
```

A variable might exist in a namespace (e.g. a `companion`):

```clawr
companion X {
data:
    x: integer
}
```

```ts
class VariableDeclaration {
  static create({
    isImmutable,
    name,
    isolationLevel,
    domain,
    initialValue,
    span,
    nameSpan,
  }: {
    isImmutable: boolean
    name: string
    isolationLevel: IsolationLevel
    domain?: DomainDeclaration
    initialValue: Expression
    span: SourceCodeSpan
    nameSpan: SourceCodeSpan
  }): VariableDeclaration
}
```
