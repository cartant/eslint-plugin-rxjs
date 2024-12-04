import { stripIndent } from 'common-tags';
import { noIgnoredSubscribeRule } from '../../src/rules/no-ignored-subscribe';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-subscribe', noIgnoredSubscribeRule, {
  valid: [
    {
      code: stripIndent`
        // not ignored
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe(value => console.log(value));
      `,
    },
    {
      code: stripIndent`
        // subject not ignored
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe(value => console.log(value));
      `,
    },
    {
      code: stripIndent`
        // not ignored non-arrow
        import { of } from "rxjs";

        function log(value) {
          console.log(value)
        }

        const observable = of([1, 2]);
        observable.subscribe(log);
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/61
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe();
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/69
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe((value) => console.log(value));
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // ignored
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe();
                   ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject ignored
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe();
                ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/69
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe();
                     ~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
