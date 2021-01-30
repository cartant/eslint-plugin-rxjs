/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-ignored-subscription");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-ignored-subscription", rule, {
  valid: [
    stripIndent`
      // const and add
      import { of } from "rxjs";
      const a = of(42).subscribe();
      a.add(of(42).subscribe());
    `,
    stripIndent`
      // let
      import { Subscription } from "rxjs";
      let b: Subscription;
      b = of(42).subscribe();
    `,
    stripIndent`
      // array element
      import { of } from "rxjs";
      const c = [of(42).subscribe()];
    `,
    stripIndent`
      // object property
      import { of } from "rxjs";
      const d = { subscription: of(42).subscribe() };
    `,
    stripIndent`
      // subscriber
      import { of, Subscriber } from "rxjs";
      const subscriber = new Subscriber<number>();
      of(42).subscribe(subscriber);
    `,
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/61
      const whatever = {
        subscribe(callback?: (value: unknown) => void) {}
      };
      whatever.subscribe(() => {});
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // ignored
        import { of } from "rxjs";
        of(42).subscribe();
               ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // ignored subject
        import { Subject } from "rxjs";
        const s = new Subject<any>()
        s.subscribe();
          ~~~~~~~~~ [forbidden]
      `
    ),
  ],
});
