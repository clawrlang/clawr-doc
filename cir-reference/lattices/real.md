<!-- markdownlint-disable MD041 MD033 -->
<img src="../../images/rawry-150.png" alt="Rawry" style="float: right; margin: 10px;">

# `real`

[CIR](../README.md) : [Lattices](../lattices/README.md)

A range of real values. A constant integer (e.g. a `const` variable or a literal) will have `min` = `max`, equal to the constant itself. Other value-sets may skip either the `min`, `max` or both properties.

If either or both limits is excluded, the value could be any real number (ℝ), and the backend `MUST` use arbitrary precision to store the value. If both limits are set, the backend `MAY` use an optimised storage type for the value.

The schema accepts either a bounded/unbounded range or a singleton value:

<!-- shape: RealSet -->

| Field      | Required | Type     | Meaning                                   |
| ---------- | -------- | -------- | ----------------------------------------- |
| `universe` | yes      | `"real"` | Declaration discriminator.                |
| `boxed`    | no       | `true`   | Present if the value is boxed.            |
| `min`      | no       | `string` | The lower bound of the range (inclusive). |
| `max`      | no       | `string` | The upper bound of the range (inclusive). |
| `value`    | no       | `string` | The single value of the set.              |

> [!info] Table: the properties of the `real` node

<!-- /shape: RealSet -->

## Rules for Frontend

## Rules for Backend

<script>
MathJax = { tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] } };
</script>
<script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
</script>
<script src="https://unpkg.com/lucide@latest"></script>
<script src="../../adr/admonitions.js"></script>
<link rel="stylesheet" href="../../adr/admonitions.css">
