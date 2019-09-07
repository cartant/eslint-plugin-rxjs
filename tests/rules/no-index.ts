/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-index");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-index", rule, {
  valid: [
    `import { Observable } from "rxjs";`,
    `import { map } from "rxjs/operators";`
  ],
  invalid: [
    {
      code: stripIndent`
        import { Observable } from "rxjs/index";
        import { map } from "rxjs/operators/index";
        import { TestScheduler } from "rxjs/testing/index";
        import { WebSocketSubject } from "rxjs/webSocket/index";
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 40
        },
        {
          messageId: "forbidden",
          line: 2,
          column: 21,
          endLine: 2,
          endColumn: 43
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 51
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 34,
          endLine: 4,
          endColumn: 56
        }
      ]
    },
    {
      code: stripIndent`
        import { Observable } from 'rxjs/index';
        import { map } from 'rxjs/operators/index';
        import { TestScheduler } from 'rxjs/testing/index';
        import { WebSocketSubject } from 'rxjs/webSocket/index';
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 40
        },
        {
          messageId: "forbidden",
          line: 2,
          column: 21,
          endLine: 2,
          endColumn: 43
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 51
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 34,
          endLine: 4,
          endColumn: 56
        }
      ]
    }
  ]
});
