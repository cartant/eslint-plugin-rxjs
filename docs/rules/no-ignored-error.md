# Enforce the passing of error handlers (`no-ignored-error`)

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

## Options

This rule has no options.