# Avoid importing internal modules (`no-internal`)

This rule effects failures if an internal module is specified as the import location.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs/internal/observable/of";
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";
```

## Options

This rule has no options.