&nbsp; / &nbsp; [CIR Reference](./README.md)

# CIR Artifact

A source module is a single `.clawr` file. The frontend analyzes the program's source modules together and emits one CIR artifact. The artifact has the following root fields, defined by [cir.schema.json](./schema/cir.schema.json):

| Field | Required | Meaning |
| ----- | -------- | ------- |
| `$schema` | yes | The format identifier, currently `http://clawr.lang/schema/cir/DRAFT-0`. |
| `declarations` | no | Array of [declarations](./declarations/README.md) for the program. |
| `startBlock` | no | Array of [statements](./statements/README.md) for the program entry point. |

Omitted arrays and empty arrays are structurally different: an executable requires a `startBlock`, even if it is empty.

## Rules for Frontend

- For an executable, there `MUST` be exactly one `@main` block across the program's source modules. The frontend `MUST` report an error if it is absent or duplicated and emit its statements in the artifact's `startBlock`.
- A library (non-executable) artifact `MUST NOT` define a `startBlock`. The frontend `MAY` allow a `@main` block in the source code, but in that case it `MUST NOT` propagate it to the CIR.

> [!warning]
> The existing library rule above predates [ADR-038](../../adr/adr-038.md), which defers library entry-point rules and separate compilation. How library artifacts are produced remains undecided.

## Rules for Backend

- The `startBlock` statements `MUST` go into the block of an `int main() {}` function (if lowering through C) or whatever equivalent the backend uses for the same purpose.
- Program-level variables `MUST` be initialized before executing any statements that depend on them.
- For the sake of optimization, the `startBlock` statements `MAY` be executed in a different order than they appear, provided that the semantic meaning is not affected.

## Example

```json
{
  "$schema": "http://clawr.lang/schema/cir/DRAFT-0",
  "startBlock": [
    {
      "kind": "VARIABLE_DECL",
      "name": "count",
      "type": { "universe": "integer", "min": "0", "max": "10" },
      "initialValue": {
        "kind": "INTEGER_LITERAL",
        "type": { "universe": "integer", "value": "1" }
      }
    },
    {
      "kind": "ASSIGN",
      "target": {
        "kind": "VARIABLE_REF",
        "name": "count",
        "type": { "universe": "integer", "min": "0", "max": "10" }
      },
      "value": {
        "kind": "INTEGER_LITERAL",
        "type": { "universe": "integer", "value": "2" }
      }
    }
  ]
}
```

The first statement declares `count` with an inclusive range of 0 through 10 and initializes it to 1. The second assigns 2 to it. The literal's singleton value-set records the exact value, while the variable reference describes the variable's declared range.
