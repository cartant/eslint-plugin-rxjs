/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-implicit-any-catch");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-implicit-any-catch", rule, {
  valid: [
    {
      code: stripIndent`
        // arrow; explicit unknown; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
        );
      `,
    },
    {
      code: stripIndent`
        // non-arrow; explicit unknown; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
        );
      `,
    },
    {
      code: stripIndent`
        // arrow; explicit unknown; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
        );
      `,
      options: [{ allowExplicitAny: false }],
    },
    {
      code: stripIndent`
        // non-arrow; explicit unknown; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
        );
      `,
      options: [{ allowExplicitAny: false }],
    },
    {
      code: stripIndent`
        // arrow; explicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: stripIndent`
        // non-arrow; explicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: any) { console.error(error); })
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // arrow; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error) => console.error(error))
                      ~~~~~ [implicitAny]
        );
      `,
      {},
      {
        output: stripIndent`
          // arrow; implicit any
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError((error: unknown) => console.error(error))
          );
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // non-arrow; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error) { console.error(error); })
                               ~~~~~ [implicitAny]
        );
      `,
      {},
      {
        output: stripIndent`
          // non-arrow; implicit any
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError(function (error: unknown) { console.error(error); })
          );
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
                      ~~~~~~~~~~ [explicitAny]
        );
      `,
      {},
      {
        output: stripIndent`
          // arrow; explicit any; default option
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError((error: unknown) => console.error(error))
          );
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // non-arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: any) { console.error(error); })
                               ~~~~~~~~~~ [explicitAny]
        );
      `,
      {},
      {
        output: stripIndent`
          // non-arrow; explicit any; default option
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError(function (error: unknown) { console.error(error); })
          );
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
                      ~~~~~~~~~~ [explicitAny]
        );
      `,
      {},
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // arrow; explicit any; explicit option
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError((error: unknown) => console.error(error))
          );
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // non-arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: any) { console.error(error); })
                               ~~~~~~~~~~ [explicitAny]
        );
      `,
      {},
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // non-arrow; explicit any; explicit option
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError(function (error: unknown) { console.error(error); })
          );
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // arrow; narrowed
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: string) => console.error(error))
                      ~~~~~~~~~~~~~ [narrowed]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // non-arrow; narrowed
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: string) { console.error(error); })
                               ~~~~~~~~~~~~~ [narrowed]
        );
      `
    ),
  ],
});
