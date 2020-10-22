# Avoid public and protected subjects (`no-exposed-subjects`)

This rule prevents the public or protected subjects. Developers should instead expose observables via the subjects' `toObservable` method.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { Subject } from "rxjs";
class Answers {
  public answers: Subject<number>;
}
```

Examples of **correct** code for this rule:

```ts
import { Subject } from "rxjs";
class Answers {
  private _answers: Subject<string>;
  get answers() {
    return this._answers.toObservable();
  }
}
```

## Options

This rule accepts a single option which is an object with an `allowProtected` property that determines whether or not protected subjects are allowed. By default, they are not.

```json
{
  "rxjs/no-exposed-subjects": [
    "error",
    { "allowProtected": true }
  ]
}
```