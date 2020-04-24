/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-unsafe-subject-next");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-unsafe-subject-next", rule, {
  valid: [
    {
      code: stripIndent`
        // number next
        import { Subject } from "rxjs";
        const s = new Subject<number>();
        s.next(42);
      `,
    },
    {
      code: stripIndent`
        // replay number next
        import { ReplaySubject } from "rxjs";
        const s = new ReplaySubject<number>();
        s.next(42);
      `,
    },
    {
      code: stripIndent`
        // any next
        import { Subject } from "rxjs";
        const s = new Subject<any>();
        s.next(42);
        s.next();
      `,
    },
    {
      code: stripIndent`
        // unknown next
        import { Subject } from "rxjs";
        const s = new Subject<unknown>();
        s.next(42);
        s.next();
      `,
    },
    {
      code: stripIndent`
        // void next
        import { Subject } from "rxjs";
        const s = new Subject<void>();
        s.next();
      `,
    },
    {
      code: stripIndent`
        // void union next
        import { Subject } from "rxjs";
        const s = new Subject<number | void>();
        s.next(42);
        s.next();
      `,
    },
  ],
  invalid: [
    {
      code: stripIndent`
        // optional number next
        import { Subject } from "rxjs";
        const s = new Subject<number>();
        s.next();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 7,
        },
      ],
    },
    {
      code: stripIndent`
        // optional replay number next
        import { ReplaySubject } from "rxjs";
        const s = new ReplaySubject<number>();
        s.next();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 7,
        },
      ],
    },
  ],
});
