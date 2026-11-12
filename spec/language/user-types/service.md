&nbsp; / &nbsp; [The Clawr Language](../README.md) &nbsp; / &nbsp; [User-Defined Types](./README.md)

# Service Types

A `service` is like an `object` with special privileges. An `object` in Clawr is just an encapsulated `data` structure. It cannot reach beyond its own memory. In some cases, however, we might want to access and modify system-wide data such as on-device sensors, a database or the internet. This is where the `service` type comes in.

A `service` is operated in very similar ways to an `object`. It is defined by its interface and its behavioural capabilities, not by its composition. Yet it is different from a simple `object` in that its state is the runtime environment rather than its own memory. While it can (and probably will) have an internal `data` structure to perhaps maintain a cache or store configuration settings, its main source of data comes from external resources far away from its own memory address. Here are some example use-cases:

- File I/O operations
- Network requests
- Database connections
- System clock access
- Random number generation
- Logging/console output
- Sensor readings
- External API calls
- Configuring the Operating System
- and more…

There is no significant runtime difference between an `object` and a `service` (nor a `data` structure for that matter). Their differences are entirely conceptual (apart from semantic constraints — which are enforced at compile-time).

## Restrictions

An `object` can be assigned to `isolated T` or `ref T` variables as needed. It excels at maintaining isolation constraints using copy-on-write. A `service`, on the other hand, can only ever be assigned to `ref T` variables.

A `service` is an _entity_, not a _variable_. It is an _agent_, not a _data container._ It represents a system resource, not its own value. Therefore, it is meaningless to copy-on-write a `service`. It is incoherent to refer to a `service` as immutable or isolated. Its _configuration_ might be immutable; it might contain copy-on-write _properties_. But the `service` itself must always apply reference semantics (through `ref T` variables and properties).

Additionally:

- `object` and `data` types cannot store a `service` as a property (and they should avoid `ref` properties in general),
- A `service` can reference other services via `ref` properties.

```clawr
// Compiler error examples:
object Student {
state:
    logger: ref Logger  // ❌ Error: objects cannot reference services
}

service DatabaseService {
state:
    logger: ref Logger  // ✅ OK: services can reference other services
}
```

This ensures clear separation: domain objects remain pure data, while services handle infrastructure concerns.

Because a `service`’s “state” is the entire computing environment, `service` variables cannot be isolated from each other. A `service` variable `MUST` be declared with the `ref` modifier (`const x: ref T` or `mut x: ref T`) and `MUST NOT` be `isolated`. The rationale is documented in [ADR-008](../../../adr/adr-008.md).

> [!warning]
> [ADR-008](../../../adr/adr-008.md) says that an `object` can store references to `service` instances in `ref` properties, which contradicts the rule above. That ADR lists it as an open question, and this page was revised later, so the stricter rule applies until the author decides.

## No `mutating:` Section

An `object` needs to declare mutable methods explicitly, indicating which operations can modify its internal state. The reason is that the compiler needs to enforce isolation and therefore has to copy the object before mutating it if it has multiple references.

In contrast, a `service` can only be `ref T`. There is no need for copy-on-write semantics, as services cannot be isolated variables. Therefore, there is also no need for a `mutating:` section in its declaration.

## Dispose Method

Services will often need cleanup, e.g. closing a file handle. When a `service` is descoped (its last variable reference is released) it will call a `dispose()` method to clean up resources it alone has depended upon and to sever any circular references it may hold. This is not yet implemented in the compiler.

> [!todo] Dispose Method
>
> Implement a dispose mechanism for services in the compiler. Decide the syntax for declaring it, and the mechanics for invoking it when a service is descoped.
>
> Idea: Use a single block annotated with `@release` (similar to the `@main` block) within the service declaration. Alternatively, use a different annotation spelling, for example: `@cleanup`, `@deinit`, `@descope`, `@destruct`, `@dispose`, `@finalize`…
