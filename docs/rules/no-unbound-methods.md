# Avoid using unbound methods as callbacks (`no-unbound-methods`)

This rule effects failures if unbound methods are passed as callbacks.

## Rule details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```ts
return this.http
  .get<Something>("https://api.some.com/things/1")
  .pipe(
    map(this.extractSomeProperty),
    catchError(this.handleError)
  );
```

Examples of **correct** code for this rule:

<!-- prettier-ignore -->
```ts
return this.http
  .get<Something>("https://api.some.com/things/1")
  .pipe(
    map((s) => this.extractSomeProperty(s)),
    catchError((e) => this.handleError(e))
  );
```

<!-- prettier-ignore -->
```ts
return this.http
  .get<Something>("https://api.some.com/things/1")
  .pipe(
    map(this.extractSomeProperty.bind(this)),
    catchError(this.handleError.bind(this))
  );
```

## Options

This rule has no options.

## Further reading

- [Avoiding unbound methods](https://ncjamieson.com/avoiding-unbound-methods/)
