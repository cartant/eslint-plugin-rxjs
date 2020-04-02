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
      // throw Error
      const a = () => { throw new Error("error"); };
    `,
    stripIndent`
      // throw any
      const a = () => { throw "error" as any };
    `,
    stripIndent`
      // throw returned any
      const a = () => { throw errorMessage(); };

      function errorMessage(): any {
        return "error";
      }
    `,
    stripIndent`
      // throwError Error
      import { throwError } from "rxjs";

      const ob1 = throwError(new Error("Boom!"));
    `,
    stripIndent`
      // throwError any
      import { throwError } from "rxjs";

      const ob1 = throwError("Boom!" as any);
    `,
    stripIndent`
      // throwError returned any
      import { throwError } from "rxjs";

      const ob1 = throwError(errorMessage());

      function errorMessage(): any {
        return "error";
      }
    `,
    stripIndent`
      // no signature
      // There will be no signature for callback and
      // that should not effect an internal error.
      declare const callback: Function;
      callback();
    `,
  ],
  invalid: [
    {
      code: stripIndent`
        // throw string
        const a = () => { throw "error"; };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 32,
        },
      ],
    },
    {
      code: stripIndent`
        // throw returned string
        const a = () => { throw errorMessage(); };

        function errorMessage() {
          return "error";
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 39,
        },
      ],
    },
    {
      code: stripIndent`
        // throw string variable
        const errorMessage = "Boom!";

        const a = () => { throw errorMessage; };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 37,
        },
      ],
    },
    {
      code: stripIndent`
        // throwError string
        import { throwError } from "rxjs";

        const ob1 = throwError("Boom!");
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 31,
        },
      ],
    },
    {
      code: stripIndent`
        // throwError returned string
        import { throwError } from "rxjs";

        const ob1 = throwError(errorMessage());

        function errorMessage() {
          return "Boom!";
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 38,
        },
      ],
    },
  ],
});
