/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-internal");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-internal", rule, {
  valid: [
    `import { Observable } from "rxjs";`,
    `import { map } from "rxjs/operators";`
  ],
  invalid: [
    {
      code: stripIndent`
        import { concat } from "rxjs/internal/observable/concat";
        import { map } from "rxjs/internal/operators/map";`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 57
        },
        {
          messageId: "forbidden",
          line: 2,
          column: 21,
          endLine: 2,
          endColumn: 50
        }
      ]
    },
    {
      code: stripIndent`
        import { concat } from 'rxjs/internal/observable/concat';
        import { map } from 'rxjs/internal/operators/map';`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 57
        },
        {
          messageId: "forbidden",
          line: 2,
          column: 21,
          endLine: 2,
          endColumn: 50
        }
      ]
    }
  ]
});
