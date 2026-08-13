<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# the Clawr Language

A language is a tool for communication. Human language likely began with gestures, facial expressions, and simple vocalizations. Over time, as our anatomy and social structures evolved, so did our ability to express complex ideas. Eventually, writing allowed knowledge to be recorded and passed across generations.

A programming language, too, is a tool for communication. It communicates instructions to a machine. And, while this might be considered its primary line of communication, it is certainly not the only one. It also read and edited by people. It expresses intent. And like all human writing, it often outlives the moment of its creation.

But there is an important difference between human and programming languages. Humans can tolerate ambiguity. We compensate with context, redundancy, and shared assumptions. A computer cannot. It does not infer. It does not read ahead for clues. It must interpret and perform each and every instruction immediately as it reads them. [^compiler] To be useful, a programming language must have a precise syntax and unambiguous semantics.

[^compiler]: Of course, the nice human-readable programming language is not what the computer sees. It sees something called machine-code. There is a translation step that is performed ahead of time to generate that code. That step is called compilation. But that does not invalidate the need for unambiguity in the source.

It may be tempting to define a programming language by its execution — what runtime it uses, what memory model it assumes, what standard library it ships with — but those are implementation details, not the language itself. They are not semantics. Semantics is the *abstract* meaning of the code, not the *concrete execution* of it.

Java is often described as more than a syntax: it is the JRE, the JDK, the ecosystem. Yet when Google adopted Java as the official language for Android, it replaced much of that ecosystem with its own SDK. The language remained recognizably Java, but the platform underneath had changed.

Clawr takes this separation further. Clawr is defined by its syntax and the meaning of each statement and expression—not by a runtime, not by an ABI, not by a memory management strategy. Those may vary. The language itself is the fixed point.

> [!note]
> In practice, a language will probably have to imply or assume some constraints on memory management — Clawrs intermediate representation e.g. assumes reference-counting — and on other technical details as well. But those are not what *defines the language*. They are *concessions to pragmatism*.
>
> If it is possible to implement a backend that employs GC instead of ARC — or some new invention as yet unknown — that would be absolutely valid. And if that requires some redesigns to the CIR, it might be worth making that change.

This section details the syntax and semantics of the Clawr language.
