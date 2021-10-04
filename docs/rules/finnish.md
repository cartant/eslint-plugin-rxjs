# Use Finnish notation (`finnish`)

This rule enforces the use of Finnish notation - i.e. the `$` suffix.

## Rule details

Examples of **incorrect** code for this rule:

```ts
const answers = of(42, 54);
```

Examples of **correct** code for this rule:

```ts
const answer$ = of(42, 54);
```

## Options

This rule accepts a single option which is an object with properties that determine whether Finnish notation is enforced for `functions`, `methods`, `parameters`, `properties` and `variables`. It also contains:

-   `names` and `types` properties that determine whether of not Finnish notation is to be enforced for specific names or types.
-   a `strict` property that, if `true`, allows the `$` suffix to be used _only_ with identifiers that have an `Observable` type.

The default (Angular-friendly) configuration looks like this:

```json
{
    "rxjs/finnish": [
        "error",
        {
            "functions": true,
            "methods": true,
            "names": {
                "^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate)$": false
            },
            "parameters": true,
            "properties": true,
            "strict": false,
            "types": {
                "^EventEmitter$": false
            },
            "variables": true
        }
    ]
}
```

The properties in the options object are themselves optional; they do not all have to be specified.

## Further reading

-   [Observables and Finnish Notation](https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b)
