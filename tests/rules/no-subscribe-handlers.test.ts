import { stripIndent } from 'common-tags';
import { noSubscribeHandlersRule } from '../../src/rules/no-subscribe-handlers';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-subscribe-handlers', noSubscribeHandlersRule, {
  valid: [
    {
      code: stripIndent`
        // ignored
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe();
      `,
    },
    {
      code: stripIndent`
        // subject ignored
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe();
      `,
    },
    {
      code: stripIndent`
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe();
      `,
    },
    {
      code: stripIndent`
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe();
      `,
    },
    {
      code: stripIndent`
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe(console.log);
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // not ignored
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe(value => console.log(value));
                   ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject not ignored
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe(value => console.log(value));
                ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // not ignored non-arrow
        import { of } from "rxjs";

        function log(value) {
          console.log(value)
        }

        const observable = of([1, 2]);
        observable.subscribe(log);
                   ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe((value) => console.log(value));
                     ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe({
                     ~~~~~~~~~ [forbidden]
          next: (value) => console.log(value)
        });
      `,
    ),
  ],
});
