# Use type-safe error handlers (`no-implicit-any-catch`)

This rule requires an explicit type annotation for error parameters in error handlers. It's similar to the TypeScript [`no-implicit-any-catch`](https://github.com/typescript-eslint/typescript-eslint/blob/e01204931e460f5e6731abc443c88d666ca0b07a/packages/eslint-plugin/docs/rules/no-implicit-any-catch.md) rule, but is for observables - not `try`/`catch` statements.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

throwError(() => new Error("Kaboom!")).pipe(
  catchError((error) => console.error(error))
);
```

```ts
import { throwError } from "rxjs";

throwError(() => new Error("Kaboom!")).subscribe({
  error: (error) => console.error(error)
});
```

```ts
import { throwError } from "rxjs";
import { tap } from "rxjs/operators";

throwError(() => new Error("Kaboom!")).pipe(
  tap(undefined, (error) => console.error(error))
);
```

Examples of **correct** code for this rule:

```ts
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

throwError(() => new Error("Kaboom!")).pipe(
  catchError((error: unknown) => console.error(error))
);
```

```ts
import { throwError } from "rxjs";

throwError(() => new Error("Kaboom!")).subscribe({
  error: (error: unknown) => console.error(error)
});
```

```ts
import { throwError } from "rxjs";
import { tap } from "rxjs/operators";

throwError(() => new Error("Kaboom!")).pipe(
  tap(undefined, (error: unknown) => console.error(error))
);
```

## Options

This rule accepts a single option which is an object with an `allowExplicitAny` property that determines whether or not the error variable can be explicitly typed as `any`. By default, the use of explicit `any` is forbidden.

```json
{
  "rxjs/no-implicit-any-catch": [
    "error",
    { "allowExplicitAny": true }
  ]
}
```

## Further reading

- [Catching Unknowns](https://ncjamieson.com/catching-unknowns/)