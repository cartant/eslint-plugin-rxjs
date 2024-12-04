import { stripIndent } from 'common-tags';
import { noSubclassRule } from '../../src/rules/no-subclass';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-subclass', noSubclassRule, {
  valid: [
    stripIndent`
      // non-RxJS Observable
      class Observable<T> { t: T; }
      class StringObservable extends Observable<string> {}
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // Observable
        import { Observable } from "rxjs";
        class GenericObservable<T> extends Observable<T> {}
                                           ~~~~~~~~~~ [forbidden]
        class StringObservable extends Observable<string> {}
                                       ~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // Subject
        import { Subject } from "rxjs";
        class GenericSubject<T> extends Subject<T> {}
                                        ~~~~~~~ [forbidden]
        class StringSubject extends Subject<string> {}
                                    ~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // Subscriber
        import { Subscriber } from "rxjs";
        class GenericSubscriber<T> extends Subscriber<T> {}
                                           ~~~~~~~~~~ [forbidden]
        class StringSubscriber extends Subscriber<string> {}
                                       ~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // AsyncSubject
        import { AsyncSubject } from "rxjs";
        class GenericAsyncSubject<T> extends AsyncSubject<T> {}
                                             ~~~~~~~~~~~~ [forbidden]
        class StringAsyncSubject extends AsyncSubject<string> {}
                                         ~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // BehaviorSubject
        import { BehaviorSubject } from "rxjs";
        class GenericBehaviorSubject<T> extends BehaviorSubject<T> {}
                                                ~~~~~~~~~~~~~~~ [forbidden]
        class StringBehaviorSubject extends BehaviorSubject<string> {}
                                            ~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // ReplaySubject
        import { ReplaySubject } from "rxjs";
        class GenericReplaySubject<T> extends ReplaySubject<T> {}
                                              ~~~~~~~~~~~~~ [forbidden]
        class StringReplaySubject extends ReplaySubject<string> {}
                                          ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // Scheduler
        import { Scheduler } from "rxjs/internal/Scheduler";
        class AnotherScheduler extends Scheduler {}
                                       ~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
