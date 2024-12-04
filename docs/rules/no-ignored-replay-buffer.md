# Disallow using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size (`rxjs-x/no-ignored-replay-buffer`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

<!-- end auto-generated rule header -->

This rule effects failures if the buffer size of a replay buffer is not explicitly specified.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { ReplaySubject } from "rxjs";
const subject = new ReplaySubject<number>();
```

```ts
import { of, shareReplay } from "rxjs";
of(42).pipe(shareReplay({ refCount: true }));
```

Examples of **correct** code for this rule:

```ts
import { ReplaySubject } from "rxjs";
const subject = new ReplaySubject<number>(1);
```

```ts
import { ReplaySubject } from "rxjs";
const subject = new ReplaySubject<number>(Infinity);
```

```ts
import { of, shareReplay } from "rxjs";
of(42).pipe(shareReplay({ refCount: true, bufferSize: 1 }));
```
