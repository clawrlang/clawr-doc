# Contributing to Clawr

Thanks for your interest! Clawr should be a community project, not a one-man show. I would prefer to eventually transfer stewardship to the community as it matures.

I only ask that you honour the original philosophy and goals, including making the compiler intelligent enough that programmers can focus on the meaningful complexities of their domain—and how to communicate that knowledge—rather than technical complications like memory management, thread safety and other distracting noise.

A few ground rules:

- PRs are welcome. If you submit a PR, please include automated tests and a short description.
- I do not guarantee to respond to issues or PRs within any timeframe.
- Stewardship can be transferred if multiple people commit to maintaining and honouring the project.
- Please follow the code style and include unit tests for new features.

## Where Documentation Belongs

This repository is the canonical documentation source. Document a feature in its current reference section when implementing it; an ADR update alone is not sufficient.

| Content                                                            | Home                                                                                            |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Current source syntax, semantics, and program organization         | [Language specification](./spec/language/README.md)                                             |
| CIR fields, node behavior, and frontend/backend obligations        | [CIR reference](./spec/cir/README.md) and its [schema](./spec/cir/schema/cir.schema.json)       |
| Portable standard-library API and contracts                        | [Standard library](./spec/stdlib/README.md) and [declaration sources](./spec/stdlib/sources.md) |
| Example compiler CLI, representation choices, or runtime algorithm | [Implementation guides](./guides/implementation/README.md)                                      |
| Example editor behavior and project discovery                      | [IDE guides](./guides/ide-reference/README.md)                                                  |
| Why a design was chosen, alternatives, and unresolved proposals    | [ADRs](./adr/README.md), linking to current rules rather than duplicating them                  |

Conformance pages are navigation checklists, not another home for rules. Draft and deferred features must be clearly separated from current behavior; implementing one part of an ADR does not adopt all its proposals.

Keep repository READMEs as entry points with links, not growing feature references. In particular, editor project markers are tool conventions, not language module boundaries.

When changing CIR fields, regenerate their documentation tables using the command in the [root README](./README.md#clawr-intermediate-representation). Update links and examples along with the rule, and validate JSON examples against the schema.

Edit this checkout, not the compiler's vendored documentation submodule or mirrored ADR/schema copies. Publish documentation changes before updating the compiler's documentation pin; ADRs and schemas are synchronized to the development repository by workflows.

If you want to become a maintainer, please open a PR adding yourself to MAINTAINERS.
