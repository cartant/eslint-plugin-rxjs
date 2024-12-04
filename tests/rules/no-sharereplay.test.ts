import { stripIndent } from 'common-tags';
import { noSharereplayRule } from '../../src/rules/no-sharereplay';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-sharereplay', noSharereplayRule, {
  valid: [
    {
      code: stripIndent`
        // config allowed refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: true })
        );`,
    },
    {
      code: stripIndent`
        // config allowed no refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: false })
        );`,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // no arguments
        const shared = of(42).pipe(
          shareReplay()
          ~~~~~~~~~~~ [forbidden]
        );
      `,
      { options: [{ allowConfig: false }] },
    ),
    fromFixture(
      stripIndent`
        // config allowed no arguments
        const shared = of(42).pipe(
          shareReplay()
          ~~~~~~~~~~~ [forbiddenWithoutConfig]
        );
      `,
      { options: [{ allowConfig: true }] },
    ),
    fromFixture(
      stripIndent`
        // one argument
        const shared = of(42).pipe(
          shareReplay(1)
          ~~~~~~~~~~~ [forbiddenWithoutConfig]
        );
      `,
    ),
    fromFixture(
      stripIndent`
        // two arguments
        const shared = of(42).pipe(
          shareReplay(1, 100)
          ~~~~~~~~~~~ [forbiddenWithoutConfig]
        );
      `,
    ),
    fromFixture(
      stripIndent`
        // three arguments
        const shared = of(42).pipe(
          shareReplay(1, 100, asapScheduler)
          ~~~~~~~~~~~ [forbiddenWithoutConfig]
        );
      `,
    ),
    fromFixture(
      stripIndent`
        // config argument refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: true })
          ~~~~~~~~~~~ [forbidden]
        );
      `,
      { options: [{ allowConfig: false }] },
    ),
    fromFixture(
      stripIndent`
        // config argument no refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: false })
          ~~~~~~~~~~~ [forbidden]
        );
      `,
      { options: [{ allowConfig: false }] },
    ),
  ],
});
