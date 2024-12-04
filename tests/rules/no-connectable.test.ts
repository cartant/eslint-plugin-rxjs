import { stripIndent } from 'common-tags';
import { noConnectableRule } from '../../src/rules/no-connectable';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-connectable', noConnectableRule, {
  valid: [
    {
      code: stripIndent`
        // multicast with selector
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(new Subject(), p => p)
        );`,
    },
    {
      code: stripIndent`
        // multicast with factory and selector
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(() => new Subject(), p => p)
        );`,
    },
    {
      code: stripIndent`
        // multicast with selector variable
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const selector = p => p;
        const result = of(42).pipe(
          multicast(() => new Subject(), selector)
        );`,
    },
    {
      code: stripIndent`
        // publish with selector
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          publish(p => p)
        );`,
    },
    {
      code: stripIndent`
        // publishReplay with selector
        import { of, Subject } from "rxjs";
        import { publishReplay } from "rxjs/operators";
        const result = of(42).pipe(
          publishReplay(1, p => p)
        )`,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // publish
        import { of, Subject } from "rxjs";
        import { publish } from "rxjs/operators";
        const result = of(42).pipe(
          publish()
          ~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      stripIndent`
        // publishBehavior
        import { of, Subject } from "rxjs";
        import { publishBehavior } from "rxjs/operators";
        const result = of(42).pipe(
          publishBehavior(1)
          ~~~~~~~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      stripIndent`
        // publishLast
        import { of, Subject } from "rxjs";
        import { publishLast } from "rxjs/operators";
        const result = of(42).pipe(
          publishLast()
          ~~~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      stripIndent`
        // publishReplay
        import { of, Subject } from "rxjs";
        import { publishReplay } from "rxjs/operators";
        const result = of(42).pipe(
          publishReplay(1)
          ~~~~~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      stripIndent`
        // multicast
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(new Subject<number>())
          ~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      stripIndent`
        // multicast with factory
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(() => new Subject<number>())
          ~~~~~~~~~ [forbidden]
        );
      `,
    ),
  ],
});
