# Disallow importing operators from `rxjs/operators` (`rxjs-x/prefer-root-operators`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This rule prevents importing from the `rxjs/operators` export site.
Most operators were moved to the `rxjs` export site in RxJS v7.2.0
(excepting a few old and deprecated operators).
The `rxjs/operators` export site has since been deprecated and will be removed in a future major version.

Note that because a few operators were renamed or not migrated to the `rxjs` export site,
this rule may not provide an automatic fixer if renaming the import path is not guaranteed to be safe.
See the documentation linked below.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { map } from 'rxjs/operators';
```

Examples of **correct** code for this rule:

```ts
import { map } from 'rxjs';
```

## Further reading

- [Importing instructions](https://rxjs.dev/guide/importing)
