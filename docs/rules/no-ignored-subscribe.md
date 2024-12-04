# Disallow calling `subscribe` without specifying arguments (`rxjs-x/no-ignored-subscribe`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures whenever `subscribe` is called without handlers.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
import { tap } from "rxjs/operators";

of(42, 54).pipe(
  tap((value) => console.log(value))
).subscribe();
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";

of(42, 54).subscribe((value) => console.log(value));
```
