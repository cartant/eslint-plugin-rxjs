# Disallow calling of `subscribe` within any RxJS operator inside a `pipe` (`rxjs-x/no-subscribe-in-pipe`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if `subscribe` is called within any operator inside a `pipe` operation.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
import { map } from "rxjs/operators";

of(42, 54).pipe(
  map(value => {
    of(value).subscribe(console.log); // This will trigger the rule
    return value * 2;
  })
).subscribe(result => console.log(result));
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";
import { map, tap } from "rxjs/operators";

of(42, 54).pipe(
  tap(value => console.log(value)),
  map(value => value * 2)
).subscribe(result => console.log(result));
```
