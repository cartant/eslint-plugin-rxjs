# Avoid banned operators (`ban-operators`)

This rule can be configured so that developers can ban any operators they want to avoid in their project.

## Options

This rule accepts a single option which is an object the keys of which are the names of operators and the values are either booleans or strings containing the explanation for the ban.

The following configuration bans `partition` and `onErrorResumeNext`:

```json
{
  "rxjs/ban-operators": [
    "error",
    {
      "partition": true,
      "map": false,
      "onErrorResumeNext": "What is this? Visual Basic?"
    }
  ]
}
