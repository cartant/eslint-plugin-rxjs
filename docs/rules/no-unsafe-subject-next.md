# Disallow unsafe optional `next` calls (`rxjs-x/no-unsafe-subject-next`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if `next` is called without an argument and the subject's value type is not `void`.

In RxJS version 6, the `next` method's `value` parameter is optional, but a value should always be specified for subjects with non-`void` element types.

## Rule details

Examples of **incorrect** code for this rule:

```ts
const subject = new Subject<number>();
subject.next();
```

Examples of **correct** code for this rule:

```ts
const subject = new Subject<void>();
subject.next();
```

```ts
const subject = new Subject<number>();
subject.next(0);
```
