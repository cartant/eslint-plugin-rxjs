# Identify subjects (`suffix-subjects`)

This rule effects failures if subject variables, properties and parameters don't conform to a naming scheme that identifies them as subjects.

## Rule details

Examples of **incorrect** code for this rule:

```ts
const answers = new Subject<number>();
```

Examples of **correct** code for this rule:

```ts
const answersSubject = new Subject<number>();
```

## Options

This rule accepts a single option which is an object with properties that determine whether Finnish notation is enforced for `parameters`, `properties` and `variables`. It also contains a `types` property that determine whether of not the naming convention is to be enforced for specific types and a `suffix` property.

The default (Angular-friendly) configuration looks like this:

```json
{
  "rxjs/suffix-subjects": [
    "error",
    {
      "parameters": true,
      "properties": true,
      "suffix": "Subject",
      "types": {
        "^EventEmitter$": false
      },
      "variables": true,
    }
  ]
}
```

The properties in the options object are themselves optional; they do not all have to be specified.