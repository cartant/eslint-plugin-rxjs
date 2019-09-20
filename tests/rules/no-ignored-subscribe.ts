/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-ignored-subscribe");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-ignored-subscribe", rule, {
  valid: [
    {
      code: stripIndent`
        // not ignored
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe(value => console.log(value));`
    },
    {
      code: stripIndent`
        // subject not ignored
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe(value => console.log(value));`
    },
    {
      code: stripIndent`
        // not ignored non-arrow
        import { of } from "rxjs";

        function log(value) {
          console.log(value)
        }

        const observable = of([1, 2]);
        observable.subscribe(log);`
    }
  ],
  invalid: [
    {
      code: stripIndent`
        // ignored
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe();
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
        // subject ignored
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe();
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
