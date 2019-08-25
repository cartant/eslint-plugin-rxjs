/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-ignored-error");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-ignored-error", rule, {
  valid: [
    stripIndent`
      import { of } from "rxjs";

      const observable = of([1, 2]);

      observable.subscribe(() => {}, () => {});
    `,
    stripIndent`
      import { Subject } from "rxjs";

      const subject = new Subject<any>();
      const observable = of([1, 2]);

      observable.subscribe(subject);
    `
  ],
  invalid: [
    {
      code: stripIndent`
        import { of } from "rxjs";

        const observable = of([1, 2]);

        observable.subscribe(() => {});
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        const observable = of([1, 2]);
        const next = () => {};

        observable.subscribe(next);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 12,
          endLine: 6,
          endColumn: 21
        }
      ]
    },
    {
      code: stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<any>();

        subject.subscribe(() => {});
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 18
        }
      ]
    },
    {
      code: stripIndent`
        import { Subject } from "rxjs";

        const next = () => {};
        const subject = new Subject<any>();

        subject.subscribe(next);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 18
        }
      ]
    }
  ]
});
