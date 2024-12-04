# Disallow passing handlers to `subscribe` (`rxjs-x/no-subscribe-handlers`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures whenever `subscribe` is called with handlers.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
import { tap } from "rxjs/operators";

of(42, 54).subscribe((value) => console.log(value));
```

```ts
import { of } from "rxjs";
import { tap } from "rxjs/operators";

of(42, 54).subscribe({
  next: (value) => console.log(value),
});
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";

of(42, 54)
  .pipe(tap((value) => console.log(value)))
  .subscribe();
```
