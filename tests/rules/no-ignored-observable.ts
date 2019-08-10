/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-ignored-observable");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-ignored-observable", rule, {
  valid: [
    stripIndent`
      import { Observable, of } from "rxjs";

      function functionSource() {
          return of(42);
      }

      function sink(source: Observable<number>) {
      }

      const a = functionSource();
      sink(functionSource());
    `,
    stripIndent`
        import { Observable, of } from "rxjs";

        const arrowSource = () => of(42);

        function sink(source: Observable<number>) {
        }

        const a = arrowSource();
        sink(arrowSource());
      `
  ],
  invalid: [
    {
      code: stripIndent`
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        functionSource();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 7,
          column: 1,
          endLine: 7,
          endColumn: 17
        }
      ]
    },
    {
      code: stripIndent`
        import { Observable, of } from "rxjs";

        const arrowSource = () => of(42);

        arrowSource();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 1,
          endLine: 5,
          endColumn: 14
        }
      ]
    }
  ]
});
