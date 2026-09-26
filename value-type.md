# Value Types in Clawr

Clawr redefines the term “value-type.” In C#, a value type is a type that uses value semantics. in Clawr, the only types that are restricted to value semantics are unboxed primitives.

In Clawr, a value type is any type that can conform to a `trait`. Put another way, a `trait` is only applicable to value types. Alternatively: a value type is any type that is not a `service`; the only types *not* able to conform to `trait`s.

A `trait` decribes a value. It says when the value is convertible to a different format or if there is metadata that can be extracted.
