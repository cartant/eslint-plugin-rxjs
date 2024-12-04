# Disallow Finnish notation (`rxjs-x/no-finnish`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule prevents the use of Finnish notation.

## Rule details

Examples of **incorrect** code for this rule:

```ts
const answer$ = of(42, 54);
```

Examples of **correct** code for this rule:

```ts
const answers = of(42, 54);
```

## Further reading

- [Observables and Finnish Notation](https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b)
