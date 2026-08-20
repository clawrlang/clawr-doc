<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `RC_TYPE_DECL`

[CIR](../README.md) : [Declarations](./README.md)

The `RC_TYPE_DECL` node defines a reference-counted type that stores its state in fields. The type might include `methods` for interactions and it might be part of an inheritance chain.

Clawr separates these types in three variants: `data`, `object` and `service`, with varying structural rules. That distinction is reflected in the CIR only in so much as disallowing certain properties unless the `methods` property is included.

```ts
type TypeDeclaration = {
  kind: 'RC_TYPE_DECL'
  name: string
  fields: {
    name: string
    valueSet: ValueSet
  }[]
} & (
  | {
      base?: CanonicalName
      methods: FunctionDeclaration[]
      initializers?: (FunctionDeclaration & { resultValueSet?: undefined })[]
      dispatchTable?: {
        slot: FunctionSignature
        declaredIn: CanonicalName
        implementedBy?: CanonicalName
      }[]
    }
  | {}
)

type CanonicalName = { name: string; namespace?: string }
```

The break in the definition above indicates that some types (`object`/`service`) include `methods`, and those types may include the optional properties `base`, `initializers` and `dispatchTable`. A type without `methods` ( `data` syntax) cannot include those properties. _All_ types however have both `name` and `fields`.

The `base` property indicates the direct supertype in an inheritance structure. While inheritance is generally not recommended, the inheritance structure `MAY` be arbitrarily long, each subtype referencing its immediate ancestor in a linked list of `base` references.

The `dispatchTable` array lists polymorphic methods by their method signature (`slot`). These methods `MAY` be called directly or through a dispatch process that selects a different implementation depending on which instance is called. See the [`CALL`](#CALL) node for details regarding invocation. The `declaredIn` property references the earliest ancestor type that first declared the slot. The `implementedBy` property references the type that defines the implementation used by the current type.

## Rules for Frontend

- `RC_TYPE_DECL declarations `MAY` incur cyclic references inside a module (a single source/CIR file).
- They `MUST NOT` cause cyclic references between modules.
  - **_TODO_** Should that only be between libraries/packages? Packages should never be allowed to form cycles anyway so it may be a moot rule in that case.
- The `initializers` are methods that are called when the type is used as a supertype. When allocated/instantiated, the subtype `MUST` always call an initializer from the supertype, after initializing all its own fields.
- Each `RC_TYPE_DECL` `MUST` have a unique `name` in its scope (i.e. unique when including the optional `namespace`). That uniqueness includes variables and functions.
- The `dispatchTable` of a subtype `MUST` include entries with the same `slot` values as defined by its supertype in the same order before adding new entries.
- The `declaredIn` and `implementedBy` properties of the `dispatchTable` `MUST` each refer to either the type itself or a type accessible through the `base` property. That type `MUST` include a method with the same signature as the corresponding `slot`.
- The `fields` of a supertype/ancestor `MAY` repeat the same name(s) as the `fields` of a subtype/descendant.
- The frontend `MUST` forbid the cedilla (`¸`), ogonek (`˛`) and caron (`ˇ`) characters in all identifiers.

## Rules for Backend

- The bodies of methods and initializers `MUST` all have access to an implicit variable `self` that has the declared type as its type.
- The `self` variable `MUST` always refer to the same instance as the `receiver` expression of each `CALL` to said method.
- Initializers officially have no return-value, but the backend `MAY` employ the fluent pattern (`return self`) to simplify lowering.
- The `fields` of all types in the inheritance hierarchy `MUST` be allocated as separate memory addresses without overlap. The methods accessing the fields `MUST` be able to reference the same property regardless where in the hierarchy they are.
- The backend `MUST` allow repeated field names in the inheritance structure without conflating them.
- `SHARED` `fields` `MUST` be implemented as pointers to separately reference-counted memory allocations.
- `ISOLATED` `fields` `MAY` be implemented as pointers to separately reference-counted allocations OR be inlined in their parent container. If inlined, they `MUST NOT` include a separate reference count, and `RETAIN`/`RELEASE` nodes that reference them `MUST` be discarded.

## JSON Schema

```json
{
  "type": "object",
  "properties": {
    "namespace": { "type": "string" },
    "kind": { "const": "RC_TYPE_DECL" },
    "name": { "type": "string" },
    "fields": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "valueSet": { "$ref": "#/$defs/ValueSet" }
        },
        "required": ["name", "valueSet"],
        "additionalProperties": false
      }
    },
    "base": { "$ref": "#/$defs/CanonicalName" },
    "methods": {
      "type": "array",
      "items": { "$ref": "#/$defs/FunctionDeclaration" }
    },
    "initializers": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/FunctionDeclaration"
      }
    },
    "dispatchTable": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "slot": { "$ref": "#/$defs/FunctionSignature" },
          "declaredIn": { "$ref": "#/$defs/CanonicalName" },
          "implementedBy": { "$ref": "#/$defs/CanonicalName" }
        },
        "required": ["slot", "declaredIn"],
        "additionalProperties": false
      }
    }
  },
  "required": ["kind", "name", "fields", "methods"],
  "additionalProperties": false
}
```

## Examples

Simple `data` structure:

```json
{
  "kind": "TYPE_DESC",
  "name": "MyDataStructure",
  "namespace": "my_namespace",
  "fields": [
    {
      "name": "myField",
      "valueSet": { "type": "integer" }
    }
  ]
}
```

Supertype with one virtual-dispatch method:

```json
{
  "kind": "RC_TYPE_DECL",
  "name": "Super",
  "fields": [
    {
      "name": "field",
      "valueSet": {
        "type": "integer",
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
      "resultValueSet": {
        "type": "integer",
        "min": "0",
        "max": "100"
      },
      "body": [
        {
          "kind": "RETURN",
          "value": {
            "kind": "FIELD_REF",
            "object": {
              "kind": "VARIABLE_REF",
              "name": "self"
            },
            "field": "field"
          }
        }
      ]
    }
  ],
  "initializers": [
    {
      "kind": "FUNCTION_DECL",
      "baseName": "init",
      "labels": ["field"],
      "parameters": [
        {
          "name": "field",
          "valueSet": {
            "type": "integer",
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
              "name": "Super"
            },
            "isolationLevel": "ISOLATED",
            "fields": [
              {
                "name": "field",
                "value": {
                  "kind": "VARIABLE_REF",
                  "name": "field"
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
        "resultValueSet": {
          "type": "integer",
          "min": "0",
          "max": "100"
        }
      },
      "declaredIn": {
        "name": "Super"
      },
      "implementedBy": {
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
  "fields": [
    {
      "name": "field",
      "valueSet": {
        "type": "integer",
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
      "resultValueSet": {
        "type": "integer",
        "min": "43",
        "max": "43"
      },
      "body": [
        {
          "kind": "RETURN",
          "value": {
            "kind": "FIELD_REF",
            "object": {
              "kind": "VARIABLE_REF",
              "name": "self"
            },
            "field": "field"
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
        "resultValueSet": {
          "type": "integer",
          "min": "0",
          "max": "100"
        }
      },
      "declaredIn": {
        "name": "Super"
      },
      "implementedBy": {
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
  "fields": [],
  "methods": [],
  "dispatchTable": [
    {
      "slot": {
        "baseName": "f",
        "labels": [],
        "parameters": [],
        "resultValueSet": {
          "type": "integer",
          "min": "0",
          "max": "100"
        }
      },
      "declaredIn": {
        "name": "Super"
      },
      "implementedBy": {
        "name": "Super"
      }
    }
  ]
}
```
