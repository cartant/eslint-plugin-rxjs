/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/throw-error");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("throw-error", rule, {
  valid: [
    stripIndent`
      const a = () => { throw new Error("error"); };
    `,
    stripIndent`
      const a = () => { throw "error" as any };
    `,
    stripIndent`
      const a = () => { throw errorMessage(); };

      function errorMessage(): any {
        return "error";
      }
    `,
    stripIndent`
      import { throwError } from "rxjs";

      const ob1 = throwError(new Error("Boom!"));
    `,
    stripIndent`
      import { throwError } from "rxjs";

      const ob1 = throwError("Boom!" as any);
    `,
    stripIndent`
      import { throwError } from "rxjs";

      const ob1 = throwError(errorMessage());

      function errorMessage(): any {
        return "error";
      }
    `,
    stripIndent`
      // There will be no signature for callback and
      // that should not effect and internal error.
      declare const callback: Function;
      callback();
    `
  ],
  invalid: [
    {
      code: `const a = () => { throw "error"; };`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: stripIndent`
        const a = () => { throw errorMessage(); };

        function errorMessage() {
          return "error";
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError("Boom!");
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 31
        }
      ]
    },
    {
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(errorMessage());

        function errorMessage() {
          return "Boom!";
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 38
        }
      ]
    }
  ]
});
