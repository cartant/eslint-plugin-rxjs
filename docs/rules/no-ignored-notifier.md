# Disallow observables not composed from the `repeatWhen` or `retryWhen` notifier (`rxjs-x/no-ignored-notifier`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if the notifier passed to a `repeatWhen` or `retryWhen` callback is not used.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { range } from "rxjs";
import { repeatWhen, take } from "rxjs/operators";

const repeating = source.pipe(
  repeatWhen(notifications => range(0, 3))
);
```

Examples of **correct** code for this rule:

```ts
import { repeatWhen, take } from "rxjs/operators";

const repeating = source.pipe(
  repeatWhen(notifications => notifications.pipe(take(3)))
);
```
