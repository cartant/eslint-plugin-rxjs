# Avoid unbounded replay buffers (`no-ignored-replay-buffer`)

This rule effects failures if the buffer size of a replay buffer is not explicitly specified.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { ReplaySubject } from "rxjs";
const subject = new ReplaySubject<number>();
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

## Options

This rule has no options.