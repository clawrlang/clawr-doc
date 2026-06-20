<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# Clawr IR

This is the main specification documentation for Clawr backend development.

TODO: This document should detail expectations from the lowering of Clawr AST nodes such as…

- Memory management and copy-on-write
  - `ALLOC(reference-counted type) -> reference-counted value`
  - `RETAIN(reference-counted value) -> reference-counted value`
  - `RELEASE(reference-counted value)`
  - `RELEASE(reference-counted variable or field) -> NULL`
  - `ENSURE_UNIQUE(isolated variable or field)`
- Declarations
  - `VARIABLE`
  - `OBJECT`
  - `DATA`
- Expressions
  - `FIELD_REFERENCE`/`VARIABLE_REFERENCE`
  - `FUNCTION_CALL`/`METHOD_CALL`
  - `ASSIGN` to field/variable
  - Literals
    - `TRUTHVALUE`
    - `INTEGER`
    - `REAL`
    - `STRING`
- Statements
  - Control flow: `IF`/`ELSE`, `WHILE`, `FOR`/`IN`
