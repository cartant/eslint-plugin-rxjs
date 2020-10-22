# Avoid unused `takeWhile` values (`no-ignored-takewhile-value`)

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

## Options

This rule has no options.