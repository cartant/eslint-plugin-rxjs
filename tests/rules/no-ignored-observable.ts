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
      // not ignored
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
      // not ignored arrow
      import { Observable, of } from "rxjs";

      const arrowSource = () => of(42);

      function sink(source: Observable<number>) {
      }

      const a = arrowSource();
      sink(arrowSource());
    `,
  ],
  invalid: [
    {
      code: stripIndent`
        // ignored
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        functionSource();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 1,
          endLine: 8,
          endColumn: 17,
        },
      ],
    },
    {
      code: stripIndent`
        // ignored arrow
        import { Observable, of } from "rxjs";

        const arrowSource = () => of(42);

        arrowSource();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 1,
          endLine: 6,
          endColumn: 14,
        },
      ],
    },
  ],
});
