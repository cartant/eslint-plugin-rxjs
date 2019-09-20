/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-index");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-index", rule, {
  valid: [
    stripIndent`
      // no index double quote
      import { Observable } from "rxjs";
      import { map } from "rxjs/operators";
      import { TestScheduler } from "rxjs/testing";
      import { WebSocketSubject } from "rxjs/webSocket";
    `,
    stripIndent`
      // no index single quote
      import { Observable } from 'rxjs';
      import { map } from 'rxjs/operators';
      import { TestScheduler } from 'rxjs/testing';
      import { WebSocketSubject } from 'rxjs/webSocket';
    `
  ],
  invalid: [
    {
      code: stripIndent`
        // index double quote
        import { Observable } from "rxjs/index";
        import { map } from "rxjs/operators/index";
        import { TestScheduler } from "rxjs/testing/index";
        import { WebSocketSubject } from "rxjs/webSocket/index";
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 28,
          endLine: 2,
          endColumn: 40
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 43
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 31,
          endLine: 4,
          endColumn: 51
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 34,
          endLine: 5,
          endColumn: 56
        }
      ]
    },
    {
      code: stripIndent`
        // index single quote
        import { Observable } from 'rxjs/index';
        import { map } from 'rxjs/operators/index';
        import { TestScheduler } from 'rxjs/testing/index';
        import { WebSocketSubject } from 'rxjs/webSocket/index';
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 28,
          endLine: 2,
          endColumn: 40
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 43
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 31,
          endLine: 4,
          endColumn: 51
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 34,
          endLine: 5,
          endColumn: 56
        }
      ]
    }
  ]
});
