# Clawr: Language Development and Philosophy

Clawr is a language with goals of clarity, a modelling focus and easy refactoring. The main development repository is found at <https://github.com/clawrlang/clawr>. Clawr tries to encourage outside-in design and a domain focus. It does not define memory layout, but focuses on semantic meaning, business logic and intent.

> [!quote]
> “It occurred to me that where they went down a dead end was because the method's contents did not match its name. These people were basically looking for a sign in the browser that would say, 'Type in here, buddy!'
>
> That's when I recognized that they needed ScreechinglyObviousCode.”
> — [Alistair Cockburn](https://kidneybone.com/c2/wiki/ScreechinglyObviousCode)

Clawr is designed according to a philosophy:

- **Clarity first**: Code should read like your intent
- **Model your domain**: Focus on what you're building, not technical plumbing
- **Refactor fearlessly**: Easy refactoring, even without automated tools
- **Embrace isolation**: Predictable behaviour through value semantics
- **Consistent encapsulation**: Fully encapsulated when modelling behaviour, exposed data when working with computational analysis

Clawr is **not for tech-bros**: Fifteen different annotations coupling your class to your database, messaging system or other technical implementation detail obscures essential information and intent. If you want to pepper your code with tailoring for your interaction with technical tools, you should consider using Java instead.

## No Backend

Clawr is essentially a compiler frontend that outputs a semantic syntax tree (SST). A complete compiler needs a backend that translates (“lowers”) the SST to machine code that can then be executed on the target hardware.

The backend is out-of-scope for the Clawr language definition and the main Clawr project. The project does include an example runtime — which should eventually grow into a full backend — but that is in no way the official truth. Clawr should be able to run on any hardware (including e.g. ternary) and it is therefore impossible to define an official ABI.

It is possible that a future specification can include an official ABI+runtime *per hardware paradigm*, but it is probably more likely that a Go-like reuse system is employed. I.e. share source code instead of a final “binary,” and recompile it for each application. Or perhaps share the SST that the frontend outputs, and let the backend lower it.

## Other Repositories

- The main repository for Clawr development is <https://github.com/clawrlang/clawr>.
- For ideas and conceptualisations you can check out the [Concept repository](https://github.com/clawrlang/clawr-concept).
- There is also a [Visual Studio Code extension](https://github.com/clawrlang/vscode-extension) for testing out the syntax.
