# Forbid the passing of handlers to `subscribe` (`no-subscribe-handlers`)

This rule effects failures whenever `subscribe` is called with handlers.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
import { tap } from "rxjs/operators";

of(42, 54).subscribe((value) => console.log(value));
```

<!-- prettier-ignore -->
```ts
import { of } from "rxjs";
import { tap } from "rxjs/operators";

of(42, 54).subscribe({
  next: (value) => console.log(value),
});
```

Examples of **correct** code for this rule:

<!-- prettier-ignore -->
```ts
import { of } from "rxjs";

of(42, 54)
  .pipe(tap((value) => console.log(value)))
  .subscribe();
```

## Options

This rule has no options.
