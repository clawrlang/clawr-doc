<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

[< encapsulation <](./encapsulation.md)x

# Inheritance

`object` and `service` types can utilise inheritance. Every type can have a single supertype of the same kind. An `object` can inherit another `object` and `service` can inherit another `service`, but an `object` cannot inherit a `service` or vice versa.

## Factories and Initializers

Initialization goes first up, then down. All the fields are initialized starting with the most concrete type and finalised at the top ancestor. Then optional secondary initialization is executed in the opposite order. This might just be how construction works in all object-oriented languages, but Clawr is different from the norm in that it uses factory methods and initializers. They are syntactically different if not semantically.

Initialization starts with a factory method. The factory method is defined in a `companion` with the same name as the instantiated type. That factory method invokes a data literal. Just as when initializing naked `data` structures, that literal must specify all the fields. The difference for `object` is that some fields can be specified indirectly. For one thing, `object` fields can have default values and hence only explicit in the literal if they need other values.

For another, the `object` might inherit fields. Those fields are not known by the `companion` and must be initialized through an inheritance initializer. That initializer is called as part of the data literal.

```clawr
object ConcreteType: Super {
state:
    concreteField: integer
}

companion ConcreteType {
    func new42() -> ConcreteType => {
        Super.init()
        concreteField: 42
    }
}
```

When the literal is invoked, it allocates enough memory to store all the fields in the inheritance hierarchy. Then the specified field values are assigned to the concrete type’s area. Finally, the (super) initializer is called.

The initializer is syntactically similar to the factory method, except it is declared in the special `inheritance:` section inside the type itself. It is also semantically similar except it does not allocate new memory.

Like the factory method, the initialiser also invokes a data literal. It too must specify all known fields declared by the type in question. And if the type is not the top of the inheritance hierarchy, it also requires an inheritance initializer call. This is repeated all the way to the highest type in the hierarchy.

```clawr
object Super: SuperSuper {
inheritance:
    func init() => {
        SuperSuper.init()
        field: 12
    }
}
state: field: integer
```

When the top initializer is invoked, it completes the memory initialization. When its literal is invoked, all the fields in the entire hierarchy will have valid values. It is now allowed to call secondary intitialization steps before returning. Those steps may include calling virtual methods that operate on fields in the subtypes.

```clawr
object SuperSuper {
inheritance:
    func init() {
        // Fields can be initialized by "assigning" to self
        self = { topField: 12 }
        performSetup()
    }
}
state: topField: integer
```

> [!tip]
> There are two syntactic forms for initializers. Use the more compact form that looks like an implicit return function when the type only needs to initialize the fields.
>
> The initializer does not technically have a return value. The implicit return form is equivalent to the assign-to-self form, but with no room for secondary setup.
>
> When you need secondary initialization, you must use the other form. Assigning to `self` is a syntactic fiction. It only means that the value will be fully initialized, and that methods on `self` can be called with expected behaviour.

When the super initializer returns, the subtype can perform its secondary setup. Now, the parent type (and its parent etc all the way up the chain) is fully initialised, so whatever the subtype does is additive to that.

Finally, the factory method returns and the object can be used.
