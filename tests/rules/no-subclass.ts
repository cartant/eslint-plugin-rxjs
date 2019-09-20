/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-subclass");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-subclass", rule, {
  valid: [
    stripIndent`
      // non-RxJS Observable
      class Observable<T> { t: T; }
      class StringObservable extends Observable<string> {}
    `
  ],
  invalid: [
    {
      code: stripIndent`
        // Observable
        import { Observable } from "rxjs";
        class GenericObservable<T> extends Observable<T> {}
        class StringObservable extends Observable<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 36,
          endLine: 3,
          endColumn: 46
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 32,
          endLine: 4,
          endColumn: 42
        }
      ]
    },
    {
      code: stripIndent`
        // Subject
        import { Subject } from "rxjs";
        class GenericSubject<T> extends Subject<T> {}
        class StringSubject extends Subject<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 40
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 36
        }
      ]
    },
    {
      code: stripIndent`
        // Subscriber
        import { Subscriber } from "rxjs";
        class GenericSubscriber<T> extends Subscriber<T> {}
        class StringSubscriber extends Subscriber<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 36,
          endLine: 3,
          endColumn: 46
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 32,
          endLine: 4,
          endColumn: 42
        }
      ]
    },
    {
      code: stripIndent`
        // AsyncSubject
        import { AsyncSubject } from "rxjs";
        class GenericAsyncSubject<T> extends AsyncSubject<T> {}
        class StringAsyncSubject extends AsyncSubject<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 50
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 34,
          endLine: 4,
          endColumn: 46
        }
      ]
    },
    {
      code: stripIndent`
        // BehaviorSubject
        import { BehaviorSubject } from "rxjs";
        class GenericBehaviorSubject<T> extends BehaviorSubject<T> {}
        class StringBehaviorSubject extends BehaviorSubject<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 41,
          endLine: 3,
          endColumn: 56
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 37,
          endLine: 4,
          endColumn: 52
        }
      ]
    },
    {
      code: stripIndent`
        // ReplaySubject
        import { ReplaySubject } from "rxjs";
        class GenericReplaySubject<T> extends ReplaySubject<T> {}
        class StringReplaySubject extends ReplaySubject<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 39,
          endLine: 3,
          endColumn: 52
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 35,
          endLine: 4,
          endColumn: 48
        }
      ]
    },
    {
      code: stripIndent`
        // Scheduler
        import { Scheduler } from "rxjs/internal/Scheduler";
        class AnotherScheduler extends Scheduler {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 32,
          endLine: 3,
          endColumn: 41
        }
      ]
    }
  ]
});
