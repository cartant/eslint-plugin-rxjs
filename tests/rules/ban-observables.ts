/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import rule = require("../../source/rules/ban-observables");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("ban-observables", rule, {
  valid: [`import { of, Observable } from "rxjs";`],
  invalid: [
    {
      code: `import { of, Observable as o, Subject } from "rxjs";`,
      options: [
        {
          of: true,
          observable: "because I say so",
          subject: false
        }
      ],
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 12,
          data: {
            name: "of",
            explanation: ""
          }
        },
        {
          messageId: "forbidden",
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 24,
          data: {
            name: "Observable",
            explanation: ": because I say so"
          }
        }
      ]
    }
  ]
});
