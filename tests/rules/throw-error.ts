/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
    fromFixture(
      stripIndent`
        // throw string
        const a = () => { throw "error"; };
                                ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // throw returned string
        const a = () => { throw errorMessage(); };
                                ~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "error";
        }
      `
    ),
    fromFixture(
      stripIndent`
        // throw string variable
        const errorMessage = "Boom!";

        const a = () => { throw errorMessage; };
                                ~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // throwError string
        import { throwError } from "rxjs";

        const ob1 = throwError("Boom!");
                               ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // throwError returned string
        import { throwError } from "rxjs";

        const ob1 = throwError(errorMessage());
                               ~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "Boom!";
        }
      `
    ),
  ],
});
