# Disallow implicit `any` error parameters in `catchError` operators (`rxjs-x/no-implicit-any-catch`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule requires an explicit type annotation for error parameters in error handlers. It's similar to the typescript-eslint [`use-unknown-in-catch-callback-variable`](https://typescript-eslint.io/rules/use-unknown-in-catch-callback-variable/) rule or the TSConfig [`useUnknownInCatchVariables`](https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables) option, but is for observables - not `try`/`catch` statements.

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

<!-- begin auto-generated rule options list -->

| Name               | Description                                           | Type    | Default |
| :----------------- | :---------------------------------------------------- | :------ | :------ |
| `allowExplicitAny` | Allow error variable to be explicitly typed as `any`. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with an `allowExplicitAny` property that determines whether or not the error variable can be explicitly typed as `any`. By default, the use of explicit `any` is allowed.

```json
{
  "rxjs-x/no-implicit-any-catch": [
    "error",
    { "allowExplicitAny": true }
  ]
}
```

## Further reading

- [Catching Unknowns](https://ncjamieson.com/catching-unknowns/)
