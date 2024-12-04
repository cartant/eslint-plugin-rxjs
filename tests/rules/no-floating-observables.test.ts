import { stripIndent } from 'common-tags';
import { noFloatingObservablesRule } from '../../src/rules/no-floating-observables';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-floating-observables', noFloatingObservablesRule, {
  valid: [
    stripIndent`
      // not ignored
      import { Observable, of } from "rxjs";

      function functionSource() {
        return of(42);
      }

      function sink(source: Observable<number>) {
      }

      functionSource().subscribe();
      const a = functionSource();
      const b = [functionSource()];
      [void functionSource()];
      sink(functionSource());
      void functionSource();
    `,
    stripIndent`
      // not ignored arrow
      import { Observable, of } from "rxjs";

      const arrowSource = () => of(42);

      function sink(source: Observable<number>) {
      }

      functionSource().subscribe();
      const a = arrowSource();
      const b = [arrowSource()];
      [void arrowSource()];
      sink(arrowSource());
      void functionSource();
    `,
    stripIndent`
      // unrelated
      function foo() {}

      [1, 2, 3, 'foo'];
      const a = [1];
      foo();
      [foo()];
      void foo();
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // ignored
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        functionSource();
        ~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // ignored arrow
        import { Observable, of } from "rxjs";

        const arrowSource = () => of(42);

        arrowSource();
        ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // chain expression
        import { Observable, of } from "rxjs";

        const arrowSource: null | (() => Observable<number>) = () => of(42);

        arrowSource?.();
        ~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // array
        import { of } from "rxjs";

        [of(42)];
         ~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // ignoreVoid false
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        void functionSource();
             ~~~~~~~~~~~~~~~~ [forbiddenNoVoid]
        void functionSource?.();
             ~~~~~~~~~~~~~~~~~~ [forbiddenNoVoid]
        [void functionSource()];
              ~~~~~~~~~~~~~~~~ [forbiddenNoVoid]
        [void functionSource?.()];
              ~~~~~~~~~~~~~~~~~~ [forbiddenNoVoid]
      `,
      {
        options: [{ ignoreVoid: false }],
      },
    ),
    fromFixture(
      stripIndent`
        // sequence expression
        import { of } from "rxjs";

        of(42), of(42), void of(42);
        ~~~~~~ [forbidden]
                ~~~~~~ [forbidden]
      `,
    ),
  ],
});
