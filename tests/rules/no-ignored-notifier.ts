/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-ignored-notifier");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-ignored-notifier", rule, {
  valid: [
    stripIndent`
      // repeatWhen not ignored
      import { of } from "rxjs";
      import { repeatWhen } from "rxjs/operators";

      const source = of(42);

      const a = source.pipe(
        repeatWhen(notifications => notifications)
      );

      const b = source.pipe(
        repeatWhen(
          function (notifications) {
            return notifications;
          }
        )
      );
    `,
    stripIndent`
      // retryWhen not ignored
      import { of } from "rxjs";
      import { retryWhen } from "rxjs/operators";

      const source = of(42);

      const g = source.pipe(
        retryWhen(errors => errors)
      );

      const h = source.pipe(
        retryWhen(
          function (errors) {
            return errors;
          }
        )
      );
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // repeatWhen ignored parameter
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(notifications => range(0, 3))
          ~~~~~~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // repeatWhen no parameter
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(() => range(0, 3))
          ~~~~~~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // repeatWhen non-arrow ignored parameter
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(
          ~~~~~~~~~~ [forbidden]
            function (notifications) {
              return range(0, 3);
            }
          )
        );
      `
    ),
    fromFixture(
      stripIndent`
        // repeatWhen non-arrow no parameter
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(
          ~~~~~~~~~~ [forbidden]
            function () {
              return range(0, 3);
            }
          )
        );
      `
    ),
    fromFixture(
      stripIndent`
        // retryWhen ignored parameter
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(errors => range(0, 3))
          ~~~~~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // retryWhen no parameter
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(() => range(0, 3))
          ~~~~~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // retryWhen non-arrow ignored parameter
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(
          ~~~~~~~~~ [forbidden]
            function (errors) {
              return range(0, 3);
            }
          )
        );
      `
    ),
    fromFixture(
      stripIndent`
        // retryWhen non-arrow no parameter
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(
          ~~~~~~~~~ [forbidden]
            function () {
              return range(0, 3);
            }
          )
        );
      `
    ),
  ],
});
