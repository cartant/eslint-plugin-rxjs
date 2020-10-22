# Avoid banned observable creators (`ban-observables`)

This rule can be configured so that developers can ban any observable creators they want to avoid in their project.

## Options

This rule accepts a single option which is an object the keys of which are the names of observable factory functions and the values are either booleans or strings containing the explanation for the ban.

The following configuration bans `partition` and `onErrorResumeNext`:

```json
{
  "rxjs/ban-observables": [
    "error",
    {
      "partition": true,
      "of": false,
      "onErrorResumeNext": "What is this? Visual Basic?"
    }
  ]
}
```