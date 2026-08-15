<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

[< `data` <](./data-structures.md)
[> inheritance >](./inheritance.md)

# Encapsulation

The `data` construct is useful when gathering related data elements. It is however primarily meant for communication protocols and large-data computation. When collecting information — protecting invariants — open access to raw data is not recommended. It is better to encapsulate that data in an `object`.

While a `data` structure is defined by its content (fields), an `object` is defined by its behaviour (methods):

```clawr
object Money {
  func dollars() -> integer
  func cents() -> integer(0..<100)
}
```

An `object` is actually an interface hiding a `data` structure. That structure is sometimes referred to as the `object`’s _state_.

```clawr
object Money {
  func dollars() => self.dollars
  func cents() => self.cents

state: // the internal data structure
  dollars: integer
  cents: integer(0..<100)
}
```

An `object` is instantiated like a `data` structure:

```clawr
const hoverConversionPrice: Money = { dollars 39_999, cents: 99 }
```

This syntax however explicitly names the constituents of the internal `state` (the fields). Because coupling to internal structures is anathema, the data literal syntax is not available except in specific locations. Instead, you should create factories that can be called from anywhere. Sometimes labelled a “static method,” a factory is a function in a `companion` namespace. It has to be defined in the same module (file), and have the same name as the `object` itself.

```clawr
companion Money {
  func of(dollars: integer, cents: integer(0..<100)) => {
    dollars, cents
  }
}
```

Now you can create new `Money` instances using the factory:

```clawr
Money.of(dollars: 39_999, cents: 99)
```

## Inheritance

```clawr
object Super {
  func field() => self.field
mutating:
  func setField(_ value: integer) {
    self.field = value
  }
inheritance:
  func constructAsSuper(field: integer) => { field }
state:
  field: integer
}

object Sub: Super {
  func subField() => self.field
mutating:
  func setSubfield(_ value: integer) {
    self.field = value
  }
state:
  field: integer // the Sub can name fields independently of Super
}

namespace Sub {
  func new(sub: integer, sup: integer) => {
    Super.constructAsSuper(field: super,
    field: sub)
  }
}

@main {
    const o = Sub.new(sub: 2, sup: 3)
    mut p = o // copy of o

    o.setField(1)
    p.setSubField(4)

    print(o.field())
    print(o.subField())
    print(p.field())
    print(p.subField())
}
```

## Entities and Value Objects

A “value-object” is an `object` that represents a “value.” That value is modelled as the entirety of the `object`’s state. The value object is useful for fail-fast validation. Value objects are immutable (read-only) and `Equatable`. Sometimes they can be `HashEquatable` which means that they can be collected in hash-sets and used as identifiers in dictionaries.

```clawr
// A value-object used for computation
object Money: Equatable {
  // Implements Equatable
  func equals(other: Money) =>
    self.dollars == other.dollars &&
    self.cents == other.cents

state:
  const dollars: integer
  const cents: integer(0..<100)
}

// A validated value-object
object SwedishID: HasStringRepresentation, HashEquatable { // "Personnummer"
  func toString() => self.value

  // HashEquatable implies Equatable
  func equals(other: SwedishID) => self.value == other.value
  // Implements HashEquatable
  func hashCode() => self.value.hashCode()

state:
  const value: string
}

companion SwedishID {
  func value(_ value: string(isValid)) -> Validated<SwedishID> => { value }
}
```

> [!info] Standard Library
>
> ```clawr
> trait HasStringRepresentation {
>   func toString() -> string
> }
>
> trait Equatable {
>   func equals(other: Self) -> boolean
> }
>
> trait HashEquatable: Equatable {
>   func hashCode() -> integer
> }
> ```

An “entity” is a mutable `object` that has an identifier.

```clawr
object O {
  func field() => self.field
mutating:
  func setField(_ value: integer) {
    self.field = value
  }
inheritance:
  func constructAsSuper(field: integer) => { field }
state:
  field: integer
}

object Sub {}

// Single “instance” (mutable, not COW). No need for `mutating:` section
companion Sub {
  func new(field: integer) => { O.constructAsSuper(field: field) }
state:
  staticField: integer
}

// Always `ref` (mutable, not COW). No need for `mutating:` section
service S {
  func read() => loadFile(FILE)
  func write(value: string) {}
inheritance:
state:
  stateField: integer
}
```

> [!warning]
> I’m wavering on whether to use the term `companion` or `namespace` for the container of factory methods.
>
> - On the one hand the concept is essentially a namespace that contains free functions (and variables) that are not attached to any specific instance. And that concept could be expanded and generalised to namespaces that do _not_ share a name with any type.
> - On the other hand a “companion” feels more strongly associated with the type in question. If the companion also has privileges regarding the type's privates, that connection is pretty important.
>
> I’ll use `companion` for now, but the future might bring new insights.
