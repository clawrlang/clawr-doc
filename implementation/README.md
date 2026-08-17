<!-- markdownlint-disable MD041 MD033 -->
<img src="../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px; width: 150px;">

# Clawr Implementation

This document describes the implementation of the [Clawr example compiler](https://github.com/clawrlang/clawr).

The compiler is separated in two parts, a [frontend](./frontend/README.md) and a [backend](./backend/README.md). The protocol between the two is described in the [official specification](../cir-reference/README.md).

> [!warning]
> The example compiler is mostly an early proof-of-concept implementation. Do not treat it as official. You should also not assume that production compilers will necessarily be based on it.
>
> The only strictly defined “Clawr” is the source code syntax, the CIR, and the semantic meaning therein.
