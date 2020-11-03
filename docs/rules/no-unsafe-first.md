# Avoid completing effects and epics (`no-unsafe-first`)

This rule effects failures if `first` is used in an effect or epic in a manner that will complete the outermost observable.

## Options

This rule accepts a single option which is an object with an `observable` property that is a regular expression used to match an effect or epic's actions observable. The default `observable` regular expression should match most effect and epic action sources.

```json
{
  "rxjs/no-unsafe-first": [
    "error",
    { "observable": "[Aa]ction(s|s\\$|\\$)$" }
  ]
}
```