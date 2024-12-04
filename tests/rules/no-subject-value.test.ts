import { stripIndent } from 'common-tags';
import { noSubjectValueRule } from '../../src/rules/no-subject-value';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-subject-value', noSubjectValueRule, {
  valid: [
    stripIndent`
      // no value
      import { BehaviorSubject } from "rxjs";
      const subject = new BehaviorSubject<number>(1);
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // value property
        import { BehaviorSubject } from "rxjs";
        const subject = new BehaviorSubject<number>(1);
        console.log(subject.value);
                            ~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // getValue method
        import { BehaviorSubject } from "rxjs";
        const subject = new BehaviorSubject<number>(1);
        console.log(subject.getValue());
                            ~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
