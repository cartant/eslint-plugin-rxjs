/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-async-subscribe");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-async-subscribe", rule, {
  valid: [
    stripIndent`
      import { of } from "rxjs";

      of("a").subscribe(() => {});
    `
  ],
  invalid: [
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("a").subscribe(async () => {
          return await "a";
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 23
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("a").subscribe(async function() {
          return await "a";
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 19,
          endLine: 3,
          endColumn: 23
        }
      ]
    }
  ]
});
