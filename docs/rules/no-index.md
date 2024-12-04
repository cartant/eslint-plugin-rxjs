# Disallow importing index modules (`rxjs-x/no-index`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

<!-- end auto-generated rule header -->

This rule effects failures if an index module is specified as the import location.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs/index";
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";
```
