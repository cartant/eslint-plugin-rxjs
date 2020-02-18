/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-topromise");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-topromise", rule, {
  valid: [
    stripIndent`
      // no toPromise
      import { of, Subject } from "rxjs";
      const a = of("a");
      a.subscribe(value => console.log(value));
    `,
    stripIndent`
      // non-observable toPromise
      const a = {
        toPromise() {
          return Promise.resolve("a");
        }
      };
      a.toPromise().then(value => console.log(value));
    `
  ],
  invalid: [
    {
      code: stripIndent`
        // observable toPromise
        import { of } from "rxjs";
        const a = of("a");
        a.toPromise().then(value => console.log(value));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 12
        }
      ]
    },
    {
      code: stripIndent`
        // subject toPromise
        import { Subject } from "rxjs";
        const a = new Subject<string>();
        a.toPromise().then(value => console.log(value));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 12
        }
      ]
    }
  ]
});
