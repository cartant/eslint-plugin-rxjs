# Avoid passing async functions to `subscribe` (`no-async-subscribe`)

This rule effects failures if async functions are passed to `subscribe`.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
of(42).subscribe(async () => console.log(value));
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";
of(42).subscribe(() => console.log(value));
```

## Options

This rule has no options.
