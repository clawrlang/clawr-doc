<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Standard Library

The Clawr standard library contains some basic functionality.

## `copy(of:)`

```clawr
func copy(of value: T) -> T
```

## `Equatable`

> [!warning]
>
> **Not Implemented**
>
> Awaiting `trait` support

Values that can be compared for equality (`==`).

```clawr
trait Equatable {
  func equals(other: Self) -> boolean
}
```

## `HashEquatable`

> [!warning]
>
> **Not Implemented**
>
> Awaiting `trait` support

Values that can be used in hash-sets and as keys in dictionaries.

```clawr
trait HashEquatable: Equatable {
  func hashCode() -> integer
}
```

## `HasStringRepresentation`

> [!warning]
>
> **Not Implemented**
>
> Awaiting `trait` support

Values that can be used in interpolated `string` literals.

```clawr
trait HasStringRepresentation {
  func toString() -> string
}
```

## `Identifiable`

> [!warning]
>
> **Not Implemented**
>
> Awaiting `trait` support

Values that can be compared for identity (`===`).

```clawr
trait Identifible {
  func id() -> Equatable
}
```

## `Ordered`

> [!warning]
>
> **Not Implemented**
>
> Awaiting `trait` support

Values that can be compared and ordered (`<`, `>`).

```clawr
trait Ordered {
  func isOrderedBefore(other: Self) -> boolean
}
```

## `print(_:)`

Prints a string value to `stdout`.

```clawr
func print(_ value: HasStringRepresentation)
```
