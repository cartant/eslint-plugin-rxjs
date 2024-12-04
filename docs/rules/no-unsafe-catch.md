# Disallow unsafe `catchError` usage in effects and epics (`rxjs-x/no-unsafe-catch`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if `catchError` is used in an effect or epic in a manner that will complete the outermost observable.

## Rule details

Examples of **incorrect** code for this rule:

```ts
actions.pipe(
  ofType("SOMETHING"),
  switchMap((action) => something(action)),
  catchError(handleError)
);
```

Examples of **correct** code for this rule:

```ts
actions.pipe(
  ofType("SOMETHING"),
  switchMap((action) => something(action).pipe(
    catchError(handleError)
  ))
);
```

```ts
actions.pipe(
  ofType("SOMETHING"),
  switchMap((action) => something(action)),
  catchError((error, caught) => {
    handleError(error);
    return caught;
  })
);
```

## Options

<!-- begin auto-generated rule options list -->

| Name         | Description                                                   | Type   | Default                  |
| :----------- | :------------------------------------------------------------ | :----- | :----------------------- |
| `observable` | A RegExp that matches an effect or epic's actions observable. | String | `[Aa]ction(s\|s\$\|\$)$` |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with an `observable` property that is a regular expression used to match an effect or epic's actions observable. The default `observable` regular expression should match most effect and epic action sources.

```json
{
  "rxjs-x/no-unsafe-catch": [
    "error",
    { "observable": "[Aa]ction(s|s\\$|\\$)$" }
  ]
}
```
