# Avoid importing index modules (`no-index`)

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

## Options

This rule has no options.