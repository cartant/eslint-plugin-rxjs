# Avoid nested `subscribe` calls (`no-nested-subscribe`)

This rule effects failures if `subscribe` is called within a `subscribe` handler.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of, timer } from "rxjs";

of(42, 54).subscribe((value) => {
  timer(1e3).subscribe(() => console.log(value));
});
```

Examples of **correct** code for this rule:

```ts
import { of, timer } from "rxjs";
import { mapTo, mergeMap } from "rxjs/operators";

of(42, 54).pipe(
  mergeMap((value) => timer(1e3).pipe(mapTo(value)))
).subscribe((value) => console.log(value));
```

## Options

This rule has no options.