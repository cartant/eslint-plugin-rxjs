# Avoid throwing non-Error values (`throw-error`)

This rule forbids throwing values that are neither `Error` nor `DOMException` instances.

## Rule details

Examples of **incorrect** code for this rule:

```ts
throw "Kaboom!";
```

```ts
import { throwError } from "rxjs";
throwError("Kaboom!");
```

```ts
import { throwError } from "rxjs";
throwError(() => "Kaboom!");
```

Examples of **correct** code for this rule:

```ts
throw new Error("Kaboom!");
```

```ts
throw new RangeError("Kaboom!");
```

```ts
throw new DOMException("Kaboom!");
```

```ts
import { throwError } from "rxjs";
throwError(new Error("Kaboom!"));
```

```ts
import { throwError } from "rxjs";
throwError(() => new Error("Kaboom!"));
```

## Options

This rule has no options.