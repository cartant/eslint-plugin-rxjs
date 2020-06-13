/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-subject-unsubscribe");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-subject-unsubscribe", rule, {
  valid: [
    stripIndent`
      // unsubscribe Subject subscription
      import { Subject } from "rxjs";
      const a = new Subject<number>();
      const asub = a.subscribe();
      asub.unsubscribe();
    `,
    stripIndent`
      // unsubscribe AsyncSubject subscription
      import { AsyncSubject } from "rxjs";
      const a = new AsyncSubject<number>();
      const asub = a.subscribe();
      asub.unsubscribe();
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // unsubscribe Subject
        import { Subject } from "rxjs";
        const b = new Subject<number>();
        b.unsubscribe();
          ~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // unsubscribe AsyncSubject
        import { AsyncSubject } from "rxjs";
        const b = new AsyncSubject<number>();
        b.unsubscribe();
          ~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // compose Subject
        import { Subject, Subscription } from "rxjs";
        const csub = new Subscription();
        const c = new Subject<number>();
        csub.add(c);
                 ~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // compose AsyncSubject
        import { AsyncSubject, Subscription } from "rxjs";
        const csub = new Subscription();
        const c = new AsyncSubject<number>();
        csub.add(c);
                 ~ [forbidden]
      `
    ),
  ],
});
