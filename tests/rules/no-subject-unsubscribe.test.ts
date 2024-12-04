import { stripIndent } from 'common-tags';
import { noSubjectUnsubscribeRule } from '../../src/rules/no-subject-unsubscribe';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-subject-unsubscribe', noSubjectUnsubscribeRule, {
  valid: [
    stripIndent`
      // unsubscribe Subject subscription
      import { Subject } from "rxjs";
      const a = new Subject<number>();
      const asub = a.subscribe();
      asub.unsubscribe();
    `,
    stripIndent`
      // unsubscribe AsyncSubject subscription
      import { AsyncSubject } from "rxjs";
      const a = new AsyncSubject<number>();
      const asub = a.subscribe();
      asub.unsubscribe();
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // unsubscribe Subject
        import { Subject } from "rxjs";
        const b = new Subject<number>();
        b.unsubscribe();
          ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // unsubscribe AsyncSubject
        import { AsyncSubject } from "rxjs";
        const b = new AsyncSubject<number>();
        b.unsubscribe();
          ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // compose Subject
        import { Subject, Subscription } from "rxjs";
        const csub = new Subscription();
        const c = new Subject<number>();
        csub.add(c);
                 ~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // compose AsyncSubject
        import { AsyncSubject, Subscription } from "rxjs";
        const csub = new Subscription();
        const c = new AsyncSubject<number>();
        csub.add(c);
                 ~ [forbidden]
      `,
    ),
  ],
});
