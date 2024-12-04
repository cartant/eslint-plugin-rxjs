# Disallow passing `async` functions to `subscribe` (`rxjs-x/no-async-subscribe`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if async functions are passed to `subscribe`.
Developers are encouraged to avoid race conditions
by instead using RxJS operators which can handle both Promises and Observables
(e.g. `concatMap`, `switchMap`, `mergeMap`, `exhaustMap`).

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";

of(42).subscribe(async value => {
    const data1 = await fetch(`https://api.some.com/things/${value}`);
    const data2 = await fetch(`https://api.some.com/things/${data1.id}`);
    console.log(data2);
});
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";

of(42).pipe(
    switchMap(value => fetch(`http://api.some.com/things/${value}`)),
    switchMap(data1 => fetch(`http://api.some.com/things/${data1.id}`)),
).subscribe(data2 => console.log(data2));
```

## Further reading

- [Why does this rule exist?](https://stackoverflow.com/q/71559135)
- [Higher-order Observables](https://rxjs.dev/guide/higher-order-observables)
