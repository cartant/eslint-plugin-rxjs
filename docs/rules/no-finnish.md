# Avoid Finnish notation (`no-finnish`)

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

## Options

This rule has no options.

## Further reading

- [Observables and Finnish Notation](https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b)