# Disallow passing unbound methods (`rxjs-x/no-unbound-methods`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if unbound methods are passed as callbacks.

## Rule details

Examples of **incorrect** code for this rule:

```ts
return this.http
  .get<Something>("https://api.some.com/things/1")
  .pipe(
    map(this.extractSomeProperty),
    catchError(this.handleError)
  );
```

Examples of **correct** code for this rule:

```ts
return this.http
  .get<Something>("https://api.some.com/things/1")
  .pipe(
    map((s) => this.extractSomeProperty(s)),
    catchError((e) => this.handleError(e))
  );
```

```ts
return this.http
  .get<Something>("https://api.some.com/things/1")
  .pipe(
    map(this.extractSomeProperty.bind(this)),
    catchError(this.handleError.bind(this))
  );
```

## Further reading

- [Avoiding unbound methods](https://ncjamieson.com/avoiding-unbound-methods/)
