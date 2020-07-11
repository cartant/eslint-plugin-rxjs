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
        // explicit unknown; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
        );
      `,
    },
    {
      code: stripIndent`
        // explicit unknown; explicit option
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
        // explicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // implicit any
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
          // implicit any
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
        // explicit any; default option
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
          // explicit any; default option
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
        // explicit any; explicit option
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
          // explicit any; explicit option
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError((error: unknown) => console.error(error))
          );
        `,
      }
    ),
  ],
});
