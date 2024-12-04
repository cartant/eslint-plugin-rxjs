# Disallow banned operators (`rxjs-x/ban-operators`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule can be configured so that developers can ban any operators they want to avoid in their project.

## Options

This rule accepts a single option which is an object the keys of which are the names of operators and the values are either booleans or strings containing the explanation for the ban.

The following configuration bans `partition` and `onErrorResumeNext`:

```json
{
  "rxjs-x/ban-operators": [
    "error",
    {
      "partition": true,
      "map": false,
      "onErrorResumeNext": "What is this? Visual Basic?"
    }
  ]
}
