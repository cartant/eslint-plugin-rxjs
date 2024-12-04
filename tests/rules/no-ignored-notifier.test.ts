import { stripIndent } from 'common-tags';
import { noIgnoredNotifierRule } from '../../src/rules/no-ignored-notifier';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-notifier', noIgnoredNotifierRule, {
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
      `,
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
      `,
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
      `,
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
      `,
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
      `,
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
      `,
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
      `,
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
      `,
    ),
  ],
});
