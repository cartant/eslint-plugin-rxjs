# Disallow calling the `unsubscribe` method of subjects (`rxjs-x/no-subject-unsubscribe`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if the `unsubscribe` method is called on subjects. The method behaves differently to the `unsubscribe` method on subscriptions and is often an error.

## Further reading

- [Closed Subjects](https://ncjamieson.com/closed-subjects/)
