# Retaining Reference-Counted Values

A simple (primitive) value is never reference-counted, but `data`, `object` and `service` types are.

When a reference-counted value is `ASSIGN`ed, used al the `initialValue` of a `VARIABLE_DECL` or passed as an argument to a `CALL`, is must be `RETAIN`ed. It is, however only explicitly `RETAIN`ed if its source is a `VARIABLE_REF` or `FIELD_REF` expression.

Functions must `RETAIN` the value before returning it. Otherwise the value might be deallocated before it can be returned. Because the value already has an extra `RETAIN` from the function body, `RETAIN`ing it in the assignment would result in a count of 2 for a single reference, and the value would leak.

Every expression that is not a `VARIABLE_REF` or a `FIELD_REF` imply some form of function call. That function is expected to return a `RETAIN`ed value when appropriate.

## What About Big Integers, Big Reals and Strings?

These are not conceptually reference-counted. They are primitive values and it is up to the backend to decide when simple forms can be used and when large pointer-structures are needed. It is an implementation detail.

It might still be wrong to not treat *all* values as reference-counted. But the frontend does not know (or can it? — better think this through) when e.g. an `integer` is the same instance as another and when they are merely similar values.
