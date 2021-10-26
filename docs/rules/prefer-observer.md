# Avoid separate handlers (`prefer-observer`)

This rule effects failures if `subscribe` - or `tap` - is called with separate handlers instead of an observer.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
of(42, 54).subscribe((value) => console.log(value));
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";
of(42, 54).subscribe({
  next: (value) => console.log(value)
});
```

## Options

This rule accepts a single option which is an object with an `allowNext` property that determines whether a single `next` callback is allowed. By default, `allowNext` is `true`.

```json
{
  "rxjs/prefer-observer": [
    "error",
    { "allowNext": false }
  ]
}
```