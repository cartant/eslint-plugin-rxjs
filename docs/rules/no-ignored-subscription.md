# Use returned subscriptions (`no-ignored-subscription`)

The effects failures if an subscription returned by call to `subscribe` is neither assigned to a variable or property or passed to a function.

## Rule details

Examples of **incorrect** code for this rule:

```ts
interval(1e3).subscribe(
  (value) => console.log(value)
);
```

Examples of **correct** code for this rule:

```ts
const subscription = interval(1e3).subscribe(
  (value) => console.log(value)
);
```

When subscribers are passed to `subscribe` they are chained, so the returned subscription can be ignored:

```ts
const numbers = new Observable<number>(subscriber => {
  interval(1e3).subscribe(subscriber);
});
```

## Options

This rule has no options.
