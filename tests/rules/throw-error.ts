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
      // throw DOMException
      const a = () => { throw new DOMException("error"); };
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
      // throwError DOMException
      import { throwError } from "rxjs";

      const ob1 = throwError(new DOMException("Boom!"));
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
      // throwError unknown
      import { throwError } from "rxjs";

      const ob1 = throwError("Boom!" as unknown);
    `,
    stripIndent`
      // throwError returned unknown
      import { throwError } from "rxjs";

      const ob1 = throwError(errorMessage());

      function errorMessage(): unknown {
        return "error";
      }
    `,
    stripIndent`
      // throwError Error with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => new Error("Boom!"));
    `,
    stripIndent`
      // throwError DOMException with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => new DOMException("Boom!"));
    `,
    stripIndent`
      // throwError any with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => "Boom!" as any);
    `,
    stripIndent`
      // throwError returned any with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => errorMessage());

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
    stripIndent`
      https://github.com/cartant/rxjs-tslint-rules/issues/85
      try {
        throw new Error("error");
      } catch (error: any) {
        throw error;
      }
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
    fromFixture(
      stripIndent`
        https://github.com/cartant/rxjs-tslint-rules/issues/86
        const a = () => { throw "error"; };
                                ~~~~~~~ [forbidden]
        const b = () => { throw new Error("error"); };
        const c = () => {
          throw Object.assign(
            new Error("Not Found"),
            { code: "NOT_FOUND" }
          );
        };
      `
    ),
    fromFixture(
      stripIndent`
        // throwError string with factory
        import { throwError } from "rxjs";

        const ob1 = throwError(() => "Boom!");
                               ~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // throwError returned string with factory
        import { throwError } from "rxjs";

        const ob1 = throwError(() => errorMessage());
                               ~~~~~~~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "Boom!";
        }
      `
    ),
  ],
});
