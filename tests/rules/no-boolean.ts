/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import rule = require("../../source/rules/no-boolean");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-boolean", rule, {
  valid: [
    `of(n).pipe(filter(value => Boolean(value)));`,
    `of(n).pipe(find(value => Boolean(value)));`,
    `of(n).pipe(first(value => Boolean(value)));`,
    `of(n).pipe(last(value => Boolean(value)));`
  ],
  invalid: [
    {
      code: `of(n).pipe(filter(Boolean));`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: `of(n).pipe(find(Boolean));`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `of(n).pipe(first(Boolean));`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: `of(n).pipe(last(Boolean));`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 24
        }
      ]
    }
  ]
});
