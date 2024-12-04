# Enforce passing only `Error` values to `throwError` (`rxjs-x/throw-error`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule forbids passing values that are not `Error` objects to `throwError`.
It's similar to the typescript-eslint [`only-throw-error`](https://typescript-eslint.io/rules/only-throw-error/) rule,
but is for the `throwError` Observable creation function - not `throw` statements.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { throwError } from "rxjs";

throwError(() => "Kaboom!");
```

Examples of **correct** code for this rule:

```ts
import { throwError } from "rxjs";

throwError(() => new Error("Kaboom!"));
```

## Options

<!-- begin auto-generated rule options list -->

| Name                   | Description                                                 | Type    | Default |
| :--------------------- | :---------------------------------------------------------- | :------ | :------ |
| `allowThrowingAny`     | Whether to always allow throwing values typed as `any`.     | Boolean | `true`  |
| `allowThrowingUnknown` | Whether to always allow throwing values typed as `unknown`. | Boolean | `true`  |

<!-- end auto-generated rule options list -->
