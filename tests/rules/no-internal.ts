/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-internal");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-internal", rule, {
  valid: [
    stripIndent`
      // no internal double quote
      import { concat } from "rxjs";
      import { map } from "rxjs/operators";
    `,
    stripIndent`
      // no internal single quote
      import { concat } from 'rxjs';
      import { map } from 'rxjs/operators';
    `
  ],
  invalid: [
    {
      code: stripIndent`
        // internal double quote
        import { concat } from "rxjs/internal/observable/concat";
        import { map } from "rxjs/internal/operators/map";
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 24,
          endLine: 2,
          endColumn: 57
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 50
        }
      ]
    },
    {
      code: stripIndent`
        // internal single quote
        import { concat } from 'rxjs/internal/observable/concat';
        import { map } from 'rxjs/internal/operators/map';
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 24,
          endLine: 2,
          endColumn: 57
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 50
        }
      ]
    }
  ]
});
