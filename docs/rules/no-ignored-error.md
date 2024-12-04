# Disallow calling `subscribe` without specifying an error handler (`rxjs-x/no-ignored-error`)

💼 This rule is enabled in the 🔒 `strict` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule enforces the passing of an error handler to `subscribe` calls.

## Rule details

Examples of **incorrect** code for this rule:

```ts
source.subscribe((value) => console.log(value));
```

```ts
source.subscribe({
  next: (value) => console.log(value)
});
```

Examples of **correct** code for this rule:

```ts
source.subscribe(
  (value) => console.log(value),
  (error) => console.error(error)
);
```

```ts
source.subscribe({
  next: (value) => console.log(value),
  error: (error) => console.error(error)
});
```
