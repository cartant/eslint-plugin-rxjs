/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import rule = require("../../source/rules/ban-observables");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("ban-observables", rule, {
  valid: [`import { concat, merge as m } from "rxjs";`],
  invalid: [
    {
      code: `import { concat, merge as m } from "rxjs";`,
      options: [
        {
          concat: true,
          merge: "because I say so"
        }
      ],
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 16,
          data: {
            name: "concat",
            explanation: ""
          }
        },
        {
          messageId: "forbidden",
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 23,
          data: {
            name: "merge",
            explanation: ": because I say so"
          }
        }
      ]
    }
  ]
});
