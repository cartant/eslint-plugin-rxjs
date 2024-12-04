# Disallow unsafe `shareReplay` usage (`rxjs-x/no-sharereplay`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

<!-- end auto-generated rule header -->

This rule effects failures if the `shareReplay` operator is used - or if it is used without specifying a `config` argument.

The behavior of `shareReplay` has changed several times - see the blog post linked below.

## Options

<!-- begin auto-generated rule options list -->

| Name          | Description                                          | Type    | Default |
| :------------ | :--------------------------------------------------- | :------ | :------ |
| `allowConfig` | Allow shareReplay if a config argument is specified. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with an `allowConfig` property that that determines whether `shareReplay` is allow if a config argument is specified. By default, `allowConfig` is `true`.

```json
{
  "rxjs-x/no-sharereplay": [
    "error",
    { "allowConfig": true }
  ]
}
```

## Further reading

- [What's changed with shareReplay](https://ncjamieson.com/whats-changed-with-sharereplay/)
