# Disallow unnecessary explicit generic type arguments (`rxjs-x/no-explicit-generics`)

💼 This rule is enabled in the 🔒 `strict` config.

<!-- end auto-generated rule header -->

This rule prevents the use of explicit type arguments when the type arguments can be inferred.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { BehaviorSubject } from "rxjs";
const subject = new BehaviorSubject<number>(42);
```

Examples of **correct** code for this rule:

```ts
import { BehaviorSubject } from "rxjs";
const subject = new BehaviorSubject(42);
```
