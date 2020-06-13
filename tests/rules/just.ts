/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // imported of
        import { of } from "rxjs";
                 ~~ [forbidden]

        const a = of("a");
                  ~~ [forbidden]
        const b = of("b");
                  ~~ [forbidden]
      `,
      {},
      {
        output: stripIndent`
          // imported of
          import { of as just } from "rxjs";

          const a = just("a");
          const b = just("b");
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // imported of with non-RxJS of
        import { of } from "rxjs";
                 ~~ [forbidden]

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
      {},
      {
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
      }
    ),
  ],
});
