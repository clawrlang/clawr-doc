&nbsp; / &nbsp; [IDE Reference](./README.md)

# VS Code Projects and Independent Scripts

These are conventions of the example VS Code extension, not language-level module or package boundaries. The [language specification](../../spec/language/programs.md) defines how ordered source modules form a program.

## Project Discovery

By default, each `.clawr` file is analyzed independently. Place an empty `.clawr-project` marker in a directory to group its descendant `.clawr` files into a project.

- The nearest enclosing marker determines project membership.
- Nested markers form separate projects.
- Files ending in `.script.clawr` remain independent, even inside a project.
- Files in a project are analyzed in lexical path order.
- Discovery stays within each workspace folder and excludes `node_modules`, `dist`, `vendor`, `.git`, and `.out`, as well as exclusions honored by VS Code's file-discovery API.

For example:

```text
example/
  .clawr-project
  01-types.clawr
  02-main.clawr
  scratch.script.clawr
  other/
    .clawr-project
    main.clawr
```

The two numbered files form one project. `scratch.script.clawr` is independent; `other/main.clawr` belongs to the nested project.

## Analysis Versus Building

The editor permits declaration-only files and does not require `@main` during analysis. Executable compilation still follows the language's entry-point requirement.

The extension supports cross-file diagnostics and go-to-definition for top-level types and functions. Rename remains single-file.

The compiler does not discover marker-based projects. Pass the project's files explicitly in the same order when [building](../implementation/programs.md).

## Migrating from `clawr.sourceFiles`

The former `clawr.sourceFiles` setting is no longer supported. Add a marker at the project root and arrange filenames so lexical order puts named aliases before their uses. Rename independent files inside the project to `*.script.clawr`, or move them outside the project.
