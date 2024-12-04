# Disallow public and protected subjects (`rxjs-x/no-exposed-subjects`)

💼 This rule is enabled in the 🔒 `strict` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule prevents exposed (i.e. non-private) subjects. Developers should instead expose observables via the subjects' `asObservable` method.

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
    return this._answers.asObservable();
  }
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name             | Description               | Type    | Default |
| :--------------- | :------------------------ | :------ | :------ |
| `allowProtected` | Allow protected subjects. | Boolean | `false` |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with an `allowProtected` property that determines whether or not protected subjects are allowed. By default, they are not.

```json
{
  "rxjs-x/no-exposed-subjects": [
    "error",
    { "allowProtected": true }
  ]
}
```
