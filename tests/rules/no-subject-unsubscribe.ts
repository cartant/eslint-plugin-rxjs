/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
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
    {
      code: stripIndent`
        // unsubscribe Subject
        import { Subject } from "rxjs";
        const b = new Subject<number>();
        b.unsubscribe();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // unsubscribe AsyncSubject
        import { AsyncSubject } from "rxjs";
        const b = new AsyncSubject<number>();
        b.unsubscribe();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // compose Subject
        import { Subject, Subscription } from "rxjs";
        const csub = new Subscription();
        const c = new Subject<number>();
        csub.add(c);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 10,
          endLine: 5,
          endColumn: 11,
        },
      ],
    },
    {
      code: stripIndent`
        // compose AsyncSubject
        import { AsyncSubject, Subscription } from "rxjs";
        const csub = new Subscription();
        const c = new AsyncSubject<number>();
        csub.add(c);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 10,
          endLine: 5,
          endColumn: 11,
        },
      ],
    },
  ],
});
