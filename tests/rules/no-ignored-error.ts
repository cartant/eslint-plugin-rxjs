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
      // noop
      import { of } from "rxjs";
      const observable = of([1, 2]);
      observable.subscribe(() => {}, () => {});
    `,
    stripIndent`
      // subject
      import { Subject } from "rxjs";
      const subject = new Subject<any>();
      const observable = of([1, 2]);
      observable.subscribe(subject);
    `
  ],
  invalid: [
    {
      code: stripIndent`
        // arrow next ignored error
        import { of } from "rxjs";
        const observable = of([1, 2]);
        observable.subscribe(() => {});
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 12,
          endLine: 4,
          endColumn: 21
        }
      ]
    },
    {
      code: stripIndent`
        // variable next ignored error
        import { of } from "rxjs";
        const observable = of([1, 2]);
        const next = () => {};
        observable.subscribe(next);
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
        // subject arrow next ignored error
        import { Subject } from "rxjs";
        const subject = new Subject<any>();
        subject.subscribe(() => {});
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 18
        }
      ]
    },
    {
      code: stripIndent`
        // subject variable next ignored error
        import { Subject } from "rxjs";
        const next = () => {};
        const subject = new Subject<any>();
        subject.subscribe(next);
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
    }
  ]
});
