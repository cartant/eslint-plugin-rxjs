# Disallow subclassing RxJS classes (`rxjs-x/no-subclass`)

💼 This rule is enabled in the 🔒 `strict` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if an RxJS class is subclassed. Developers are encouraged to avoid subclassing RxJS classes, as some public and protected implementation details might change in the future.
