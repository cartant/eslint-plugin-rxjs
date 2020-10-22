# Avoid `shareReplay` (`no-sharereplay`)

This rule effects failures if the `shareReplay` operator is used - or if it is used without specifying a `config` argument.

The behaviour of `shareReplay` has changed several times - see the blog post linked below.

## Options

This rule accepts a single option which is an object with an `allowConfig` property that that determines whether `shareReplay` is allow if a config argument is specified. By default, `allowConfig` is `true`.

```json
{
  "rxjs/no-sharereplay": [
    "error",
    { "allowConfig": true }
  ]
}
```

## Further reading

- [What's changed with shareReplay](https://ncjamieson.com/whats-changed-with-sharereplay/)