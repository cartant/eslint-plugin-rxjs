# Avoid the static `create` function (`no-create`)

This rule prevents the use of the static `create` function in `Observable`. Developers should use `new` and the constructor instead.

## Rule details

Examples of **incorrect** code for this rule:

```ts
const answers = Observable.create(subscriber => {
  subscriber.next(42);
  subscriber.next(54);
  subscriber.complete();
});
```

Examples of **correct** code for this rule:

```ts
const answers = new Observable<number>(subscriber => {
  subscriber.next(42);
  subscriber.next(54);
  subscriber.complete();
});
```

## Options

This rule has no options.