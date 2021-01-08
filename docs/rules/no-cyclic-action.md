# Avoid cyclic actions in effects and epics (`no-cyclic-action`)

This rule effects failures for effects and epics that emit actions that would pass their `ofType` filter. Such actions are cyclic and, upon emission, immediately re-trigger the effect or epic.

## Rule details

Examples of **incorrect** code for this rule:

```ts
actions.pipe(
  ofType("SOMETHING"),
  map(() => ({ type: "SOMETHING" }))
);
```

Examples of **correct** code for this rule:

```ts
actions.pipe(
  ofType("SOMETHING"),
  map(() => ({ type: "SOMETHING_ELSE" }))
);
```

This rule can be used with effects _and epics_, so it makes __no attempt__ to discern whether or not dispatching is disabled for an NgRx effect. That is, code like this will effect (🙈) a failure:

```ts
someEffect = createEffect(() =>
  this.actions$.pipe(
    ofType("SOMETHING"),
    tap(() => console.log("do something")),
  ),
  { dispatch: false }
);
```

Instead, you can use the the RxJS [`ignoreElements`](https://rxjs.dev/api/operators/ignoreElements) operator:

```ts
someEffect = createEffect(() =>
  this.actions$.pipe(
    ofType("SOMETHING"),
    tap(() => console.log("do something")),
    ignoreElements()
  )
);
```

Or you can use an ESLint [inline comment](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments) to disable the rule for a specific effect.

## Options

This rule accepts a single option which is an object with an `observable` property that is a regular expression used to match an effect or epic's actions observable. The default `observable` regular expression should match most effect and epic action sources.

```json
{
  "rxjs/no-cyclic-action": [
    "error",
    { "observable": "[Aa]ction(s|s\\$|\\$)$" }
  ]
}
```