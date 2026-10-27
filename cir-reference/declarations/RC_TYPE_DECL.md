# `RC_TYPE_DECL`

<!-- markdownlint-disable MD033 -->

[CIR](../README.md) : [Declarations](./README.md)

The `RC_TYPE_DECL` node defines a reference-counted type that stores its state in properties. The type might include `methods` for interactions and it might be part of an inheritance chain.

Clawr separates these types in three variants: `data`, `object` and `service`, with varying structural rules. That distinction is reflected in the CIR only in so much as disallowing certain properties unless the `methods` property is included.

<!-- shape: RCTypeDeclaration -->

| Field           | Required | Type                        | Meaning                                                     |
| --------------- | -------- | --------------------------- | ----------------------------------------------------------- |
| `kind`          | yes      | `"RC_TYPE_DECL"`            | Declaration discriminator.                                  |
| `name`          | yes      | `string`                    | The name of the declared type.                              |
| `namespace`     | no       | `string`                    | Optional namespace.                                         |
| `properties`    | yes      | `PropertyDeclaration[]`     | The stored properties of the declared type.                 |
| `conformances`  | no       | `Conformance[]`             | Interfaces the declared type conforms to.                   |
| `base`          | no       | `CanonicalName`             | The supertype of the declared type.                         |
| `methods`       | no       | `FunctionDeclaration[]`     | The methods of the declared type.                           |
| `initializers`  | no       | `FunctionDeclarationVoid[]` | Initializer methods of the declared type.                   |
| `dispatchTable` | no       | `DispatchTableEntry[]`      | Table for looking up interface conformance implementations. |

> [!info] Table: the properties of the `RC_TYPE_DECL` node

<!-- /shape: RCTypeDeclaration -->

<!-- shape: CanonicalName -->

| Field       | Required | Type     | Meaning             |
| ----------- | -------- | -------- | ------------------- |
| `name`      | yes      | `string` | The name of a type. |
| `namespace` | no       | `string` | Optional namespace. |

> [!info] Table: the properties of the `CanonicalName` node

<!-- /shape: CanonicalName -->

<!-- shape: Conformance -->

| Field          | Required | Type            | Meaning                             |
| -------------- | -------- | --------------- | ----------------------------------- |
| `interface`    | yes      | `CanonicalName` | The interface the type conforms to. |
| `fulfillments` | yes      | `Fulfillment[]` | Lookup table for implementations.   |

> [!info] Table: the properties of the `Conformance` node

<!-- /shape: Conformance -->

<!-- shape: DispatchTableEntry -->

| Field            | Required | Type                | Meaning                                                         |
| ---------------- | -------- | ------------------- | --------------------------------------------------------------- |
| `slot`           | yes      | `FunctionSignature` | The requirement.                                                |
| `declaredIn`     | yes      | `CanonicalName`     | The type that introduces the requirement.                       |
| `implementation` | no       | `CanonicalName`     | The type (itself or supertype) that implements the requirement. |

> [!info] Table: the properties of the `DispatchTableEntry` node

<!-- /shape: DispatchTableEntry -->

<!-- shape: Fulfillment -->

| Field            | Required | Type           | Meaning                                              |
| ---------------- | -------- | -------------- | ---------------------------------------------------- |
| `requirement`    | yes      | `FunctionName` | The required method name.                            |
| `implementation` | yes      | `FunctionName` | The name of the method that fulfils the requirement. |

> [!info] Table: the properties of the `Fulfillment` node

<!-- /shape: Fulfillment -->

<!-- shape: FunctionSignature -->

| Field        | Required | Type                              | Meaning                                   |
| ------------ | -------- | --------------------------------- | ----------------------------------------- |
| `baseName`   | yes      | `string`                          | Function base name.                       |
| `labels`     | yes      | `string[]`                        | Labels; part of the unique function name. |
| `parameters` | yes      | `Parameter[]`                     | Each parameter has `name` and `type`.     |
| `returnType` | yes      | <code>ValueSet &#124; Void</code> | `{"universe":"void"}` means no result.    |

> [!info] Table: the properties of the `FunctionSignature` node

<!-- /shape: FunctionSignature -->

<!-- shape: Parameter -->

| Field  | Required | Type       | Meaning                    |
| ------ | -------- | ---------- | -------------------------- |
| `name` | yes      | `string`   | The name of the parameter. |
| `type` | yes      | `ValueSet` | The type of the parameter. |

> [!info] Table: the properties of the `Parameter` node

<!-- /shape: Parameter -->

<!-- shape: PropertyDeclaration -->

| Field  | Required | Type       | Meaning                   |
| ------ | -------- | ---------- | ------------------------- |
| `name` | yes      | `string`   | The name of the property. |
| `type` | yes      | `ValueSet` | The type of the property. |

> [!info] Table: the properties of the `PropertyDeclaration` node

<!-- /shape: PropertyDeclaration -->

The break in the definition above indicates that some types (`object`/`service`) include `methods`, and those types may include the optional properties `base`, `initializers` and `dispatchTable`. A type without `methods` ( `data` syntax) cannot include those properties. _All_ types however have both `name` and `properties`.

The `base` property indicates the direct supertype in an inheritance structure. While inheritance is generally not recommended, the inheritance structure `MAY` be arbitrarily long, each subtype referencing its immediate ancestor in a linked list of `base` references.

The `dispatchTable` array lists polymorphic methods by their method signature (`slot`). These methods `MAY` be called directly or through a dispatch process that selects a different implementation depending on which instance is called. See the [`CALL`](../expressions/CALL.md) node for details regarding invocation. The `declaredIn` property references the earliest ancestor type that first declared the slot. The `implementation` property references the type that defines the implementation used by the current type.

## Rules for Frontend

- `RC_TYPE_DECL` declarations `MAY` incur cyclic references inside a module (a single source/CIR file).
- They `MUST NOT` cause cyclic references between modules.
  - **_TODO_** Should that only be between libraries/packages? Packages should never be allowed to form cycles anyway so it may be a moot rule in that case.
- The `initializers` are methods that are called when the type is used as a supertype. When allocated/instantiated, the subtype `MUST` always call an initializer from the supertype, after initializing all its own properties.
- Each `RC_TYPE_DECL` `MUST` have a unique `name` in its scope (i.e. unique when including the optional `namespace`). That uniqueness includes variables and functions.
- The `dispatchTable` of a subtype `MUST` include entries with the same `slot` values as defined by its supertype in the same order before adding new entries.
- The `declaredIn` and `implementation` properties of the `dispatchTable` `MUST` each refer to either the type itself or a type accessible through the `base` property. That type `MUST` include a method with the same signature as the corresponding `slot`.
- The `properties` of a supertype/ancestor `MAY` repeat the same name(s) as the `properties` of a subtype/descendant.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

## Rules for Backend

- The bodies of methods and initializers `MUST` all have access to an implicit variable `self` that has the declared type as its type.
- The `self` variable `MUST` always refer to the same instance as the `receiver` expression of each `CALL` to said method.
- Initializers officially have no return-value, but the backend `MAY` employ the fluent pattern (`return self`) to simplify lowering.
- The `properties` of all types in the inheritance hierarchy `MUST` be allocated as separate memory addresses without overlap. The methods accessing the properties `MUST` be able to reference the same property regardless where in the hierarchy they are.
- The backend `MUST` allow repeated property names in the inheritance structure without conflating them.
- `SHARED` `properties` `MUST` be implemented as pointers to separately reference-counted memory allocations.
- `ISOLATED` `properties` `MAY` be implemented as pointers to separately reference-counted allocations OR be inlined in their parent container. If inlined, they `MUST NOT` include a separate reference count, and `RETAIN`/`RELEASE` nodes that reference them `MUST` be discarded.

## Examples

Simple `data` structure:

```json
{
  "kind": "RC_TYPE_DECL",
  "name": "MyDataStructure",
  "namespace": "my_namespace",
  "properties": [
    {
      "name": "myProperty",
      "type": { "universe": "integer" }
    }
  ]
}
```

Supertype with one virtual-dispatch method:

```json
{
  "kind": "RC_TYPE_DECL",
  "name": "Super",
  "properties": [
    {
      "name": "property",
      "type": {
        "universe": "integer",
        "min": "0",
        "max": "100"
      }
    }
  ],
  "methods": [
    {
      "kind": "FUNCTION_DECL",
      "baseName": "f",
      "labels": [],
      "parameters": [],
      "returnType": {
        "universe": "integer",
        "min": "0",
        "max": "100"
      },
      "body": [
        {
          "kind": "RETURN",
          "value": {
            "kind": "PROPERTY_REF",
            "object": {
              "kind": "VARIABLE_REF",
              "name": "self",
              "type": { "universe": "rc-type", "name": "Super" }
            },
            "property": "property",
            "type": { "universe": "integer", "min": "0", "max": "100" }
          }
        }
      ]
    }
  ],
  "initializers": [
    {
      "kind": "FUNCTION_DECL",
      "baseName": "init",
      "labels": ["property"],
      "returnType": { "universe": "void" },
      "parameters": [
        {
          "name": "property",
          "type": {
            "universe": "integer",
            "min": "0",
            "max": "100"
          }
        }
      ],
      "body": [
        {
          "kind": "ASSIGN",
          "target": {
            "kind": "VARIABLE_REF",
            "name": "self"
          },
          "value": {
            "kind": "ALLOCATION",
            "type": {
              "universe": "rc-type",
              "name": "Super"
            },
            "isolationLevel": "ISOLATED",
            "properties": [
              {
                "name": "property",
                "value": {
                  "kind": "VARIABLE_REF",
                  "name": "property",
                  "type": { "universe": "integer", "min": "0", "max": "100" }
                }
              }
            ]
          }
        }
      ]
    }
  ],
  "dispatchTable": [
    {
      "slot": {
        "baseName": "f",
        "labels": [],
        "parameters": [],
        "returnType": {
          "universe": "integer",
          "min": "0",
          "max": "100"
        }
      },
      "declaredIn": {
        "name": "Super"
      },
      "implementation": {
        "name": "Super"
      }
    }
  ]
}
```

Subtype without overrides:

```json
{
  "kind": "RC_TYPE_DECL",
  "name": "Sub1",
  "base": {
    "name": "Super"
  },
  "properties": [
    {
      "name": "property",
      "type": {
        "universe": "integer",
        "min": "0",
        "max": "100"
      }
    }
  ],
  "methods": [
    {
      "kind": "FUNCTION_DECL",
      "baseName": "f",
      "labels": [],
      "parameters": [],
      "returnType": {
        "universe": "integer",
        "min": "43",
        "max": "43"
      },
      "body": [
        {
          "kind": "RETURN",
          "value": {
            "kind": "PROPERTY_REF",
            "object": {
              "kind": "VARIABLE_REF",
              "name": "self",
              "type": { "universe": "rc-type", "name": "Sub1" }
            },
            "property": "property",
            "type": { "universe": "integer", "min": "0", "max": "100" }
          }
        }
      ]
    }
  ],
  "dispatchTable": [
    {
      "slot": {
        "baseName": "f",
        "labels": [],
        "parameters": [],
        "returnType": {
          "universe": "integer",
          "min": "0",
          "max": "100"
        }
      },
      "declaredIn": {
        "name": "Super"
      },
      "implementation": {
        "name": "Sub1"
      }
    }
  ]
}
```

Subtype that overrides a method:

```json
{
  "kind": "RC_TYPE_DECL",
  "name": "Sub2",
  "base": {
    "name": "Super"
  },
  "properties": [],
  "methods": [],
  "dispatchTable": [
    {
      "slot": {
        "baseName": "f",
        "labels": [],
        "parameters": [],
        "returnType": {
          "universe": "integer",
          "min": "0",
          "max": "100"
        }
      },
      "declaredIn": {
        "name": "Super"
      },
      "implementation": {
        "name": "Super"
      }
    }
  ]
}
```
