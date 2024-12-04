import { stripIndent } from 'common-tags';
import { noCreateRule } from '../../src/rules/no-create';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-create', noCreateRule, {
  valid: [],
  invalid: [
    fromFixture(
      stripIndent`
        // create
        import { Observable, Observer } from "rxjs";

        const ob = Observable.create((observer: Observer<string>) => {
                              ~~~~~~ [forbidden]
            observer.next("Hello, world.");
            observer.complete();
            return () => {};
        });
      `,
    ),
  ],
});
