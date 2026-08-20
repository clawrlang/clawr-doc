<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `ClawrModule`

A _module_ is a single .clawr code file. The file `MAY` contain a single `@main {}` block for running the program. The frontend `MUST` add this block as `startBlock` in the CIR.

```ts
type ClawrModule = {
  $schema: 'http://clawr.lang/schema/cir/DRAFT-0'
  startBlock?: Statement[]
  declarations?: Declaration[]
}
```
## Rules for Frontend

- A module `MAY` include zero or one `startBlock` nodes.
- There `MUST` be no more than one `startBlock` in the entire program, even in a multi-module project. If there are multiple `@main` blocks in the source code, the frontend `MUST` exit with an error status.
- An executable product `MUST` contain a `startBlock`. If the programmer does not define a `@main` block, the frontend `MUST` exit with an error status.
- A library (non-executable) product `MUST NOT` define a `startBlock`. The frontend `MAY` allow a `@main` block in the source code, but in such case it `MUST NOT` propagate to the CIR.

## Rules for Backend

- The `startBlock` statements `MUST` go into the block of an `int main() {}` function (if lowering though C) or whatever equivalent the backend uses for the same purpose.
- Module-level variables `MUST` be initialized before executing any statements that depend on them.
- For the sake of optimization, the `startBlock` statements `MAY` be executed in a different order than they appear, provided that the semantic meaning is not affected.

## Example

```json
{
  "startBlock": [
    {
      "type": "EXEC",
      "name": {
        "baseName": "print",
        "labels": []
      },
      "arguments": [{ "kind": "INTEGER_LITERAL", "value": "42" }]
    }
  ]
}
```
