# Disallow unsafe `switchMap` usage in effects and epics (`rxjs-x/no-unsafe-switchmap`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if `switchMap` is used in effects or epics that perform actions other than reads. For a detailed explanation, see the blog post linked below.

## Options

<!-- begin auto-generated rule options list -->

| Name         | Description                                                                                  | Type   | Default                  |
| :----------- | :------------------------------------------------------------------------------------------- | :----- | :----------------------- |
| `allow`      | Action types that are allowed to be used with switchMap. Mutually exclusive with `disallow`. |        |                          |
| `disallow`   | Action types that are disallowed to be used with switchMap. Mutually exclusive with `allow`. |        |                          |
| `observable` | A RegExp that matches an effect or epic's actions observable.                                | String | `[Aa]ction(s\|s\$\|\$)$` |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with `allow`, `disallow` and `observable` properties.

The `observable` property is a regular expression used to match an effect or epic's actions observable. The default `observable` regular expression should match most effect and epic action sources.

The `allow` or `disallow` properties are mutually exclusive. Whether or not `switchMap` is allowed will depend upon the matching of action types with `allow` or `disallow`. The properties can be specified as regular expression strings or as arrays of words.

```json
{
  "rxjs-x/no-unsafe-switchmap": [
    "error",
    {
      "disallow": [
        "add",
        "create",
        "delete",
        "post",
        "put",
        "remove",
        "set",
        "update"
      ],
      "observable": "[Aa]ction(s|s\\$|\\$)$"
    }
  ]
}
```

The properties in the options object are themselves optional; they do not all have to be specified.

## Further reading

- [Avoiding switchMap-related bugs](https://ncjamieson.com/avoiding-switchmap-related-bugs/)
