# Disallow ignoring the value within `takeWhile` (`rxjs-x/no-ignored-takewhile-value`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

<!-- end auto-generated rule header -->

This rule effects failures if the value received by a `takeWhile` callback is not used in an expression.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { takeWhile } from "rxjs/operators";

let flag = true;
const whilst = source.pipe(takeWhile(() => flag));
```

Examples of **correct** code for this rule:

```ts
import { takeWhile } from "rxjs/operators";

const whilst = source.pipe(takeWhile(value => value));
```
