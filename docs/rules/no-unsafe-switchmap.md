# Avoid `switchMap` bugs in effects and epics (`no-unsafe-switchmap`)

This rule effects failures if `switchMap` is used in effects or epics that perform actions other than reads. For a detailed explanation, see the blog post linked below.

## Options

This rule accepts a single option which is an object with `allow`, `disallow` and `observable` properties.

The `observable` property is a regular expression used to match an effect or epic's actions observable. The default `observable` regular expression should match most effect and epic action sources.

The `allow` or `disallow` properties are mutually exclusive. Whether or not `switchMap` is allowed will depend upon the matching of action types with `allow` or `disallow`. The properties can be specified as regular expression strings or as arrays of words.

```json
{
  "rxjs/no-unsafe-switchmap": [
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