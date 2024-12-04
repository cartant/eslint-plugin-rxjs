import { stripIndent } from 'common-tags';
import { noUnsafeSubjectNext } from '../../src/rules/no-unsafe-subject-next';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-unsafe-subject-next', noUnsafeSubjectNext, {
  valid: [
    {
      code: stripIndent`
        // number next
        import { Subject } from "rxjs";
        const s = new Subject<number>();
        s.next(42);
      `,
    },
    {
      code: stripIndent`
        // replay number next
        import { ReplaySubject } from "rxjs";
        const s = new ReplaySubject<number>();
        s.next(42);
      `,
    },
    {
      code: stripIndent`
        // any next
        import { Subject } from "rxjs";
        const s = new Subject<any>();
        s.next(42);
        s.next();
      `,
    },
    {
      code: stripIndent`
        // unknown next
        import { Subject } from "rxjs";
        const s = new Subject<unknown>();
        s.next(42);
        s.next();
      `,
    },
    {
      code: stripIndent`
        // void next
        import { Subject } from "rxjs";
        const s = new Subject<void>();
        s.next();
      `,
    },
    {
      code: stripIndent`
        // void union next
        import { Subject } from "rxjs";
        const s = new Subject<number | void>();
        s.next(42);
        s.next();
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/76
        import { Subject } from "rxjs";
        const s = new Subject();
        s.next();
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // optional number next
        import { Subject } from "rxjs";
        const s = new Subject<number>();
        s.next();
          ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // optional replay number next
        import { ReplaySubject } from "rxjs";
        const s = new ReplaySubject<number>();
        s.next();
          ~~~~ [forbidden]
      `,
    ),
  ],
});
