/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/just");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("just", rule, {
  valid: [
    stripIndent`
      function foo(): void {
        function of(): void {}
        of();
      }

      function bar(of: Function): void {
          of();
      }

      function baz(): void {
          const of = () => {};
          of();
      }
    `
  ],
  invalid: [
    {
      code: stripIndent`
        import { of } from "rxjs";

        const a = of("a");
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 12
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        function foo(): void {
            function of(): void {}
            of();
        }

        function bar(of: Function): void {
            of();
        }

        function baz(): void {
            const of = () => {};
            of();
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 12
        }
      ]
    }
  ]
});
