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
      // non-RxJS of
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
    stripIndent`
      // aliased as bar
      import { of as bar } from "rxjs";

      const a = bar("a");
    `,
    stripIndent`
      // aliased as of
      import { of as of } from "rxjs";

      const a = of("a");
    `
  ],
  invalid: [
    {
      code: stripIndent`
        // imported of
        import { of } from "rxjs";

        const a = of("a");
        const b = of("b");
      `,
      output: stripIndent`
        // imported of
        import { of as just } from "rxjs";

        const a = just("a");
        const b = just("b");
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 12
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 13
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        // imported of with non-RxJS of
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
      output: stripIndent`
        // imported of with non-RxJS of
        import { of as just } from "rxjs";

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
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 12
        }
      ]
    }
  ]
});
