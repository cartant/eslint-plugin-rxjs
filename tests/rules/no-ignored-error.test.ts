import { stripIndent } from 'common-tags';
import { noIgnoredErrorRule } from '../../src/rules/no-ignored-error';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-error', noIgnoredErrorRule, {
  valid: [
    stripIndent`
      // noop
      import { of } from "rxjs";
      const observable = of([1, 2]);
      observable.subscribe(() => {}, () => {});
    `,
    stripIndent`
      // observer argument
      import { of } from "rxjs";

      const observable = of([1, 2]);
      observable.subscribe({ next: () => {}, error: () => {} });

      const observer1 = { next: () => {}, error: () => {} };
      observable.subscribe(observer1);

      const obj = { observer: observer1 };
      observable.subscribe(obj.observer);
    `,
    stripIndent`
      // subject
      import { Subject } from "rxjs";
      const subject = new Subject<any>();
      const observable = of([1, 2]);
      observable.subscribe(subject);
    `,
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/61
      const whatever = {
        subscribe(
          next?: (value: unknown) => void,
          error?: (error: unknown) => void
        ) {}
      };
      whatever.subscribe();
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // arrow next ignored error
        import { of } from "rxjs";
        const observable = of([1, 2]);
        observable.subscribe(() => {});
                   ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // variable next ignored error
        import { of } from "rxjs";
        const observable = of([1, 2]);
        const next = () => {};
        observable.subscribe(next);
                   ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject arrow next ignored error
        import { Subject } from "rxjs";
        const subject = new Subject<any>();
        subject.subscribe(() => {});
                ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject variable next ignored error
        import { Subject } from "rxjs";
        const next = () => {};
        const subject = new Subject<any>();
        subject.subscribe(next);
                ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/60
        import { Observable } from "rxjs"
        interface ISomeExtension {
          sayHi(): void
        }
        function subscribeObservable<T>(obs: Observable<T>) {
          return obs.subscribe((v: T) => {})
                     ~~~~~~~~~ [forbidden]
        }
        function subscribeObservableWithExtension<T>(obs: Observable<T> & ISomeExtension) {
          return obs.subscribe((v: T) => {})
                     ~~~~~~~~~ [forbidden]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // observer argument
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe({ next: () => {} });
                   ~~~~~~~~~ [forbidden]
        const observer1 = { next: () => {} };
        observable.subscribe(observer1);
                   ~~~~~~~~~ [forbidden]
        const obj = { observer: observer1 };
        observable.subscribe(obj.observer1);
                   ~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
