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
      class Observable<T> { t: T; }

      class StringObservable extends Observable<string> {}
    `
  ],
  invalid: [
    {
      code: stripIndent`
        import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject, Subscriber } from "rxjs";
        import { Scheduler } from "rxjs/internal/Scheduler";

        class GenericObservable<T> extends Observable<T> {}
        class StringObservable extends Observable<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 36,
          endLine: 4,
          endColumn: 46
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 32,
          endLine: 5,
          endColumn: 42
        }
      ]
    },
    {
      code: stripIndent`
        import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject, Subscriber } from "rxjs";
        import { Scheduler } from "rxjs/internal/Scheduler";

        class GenericSubject<T> extends Subject<T> {}
        class StringSubject extends Subject<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 33,
          endLine: 4,
          endColumn: 40
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 29,
          endLine: 5,
          endColumn: 36
        }
      ]
    },
    {
      code: stripIndent`
        import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject, Subscriber } from "rxjs";
        import { Scheduler } from "rxjs/internal/Scheduler";

        class GenericSubscriber<T> extends Subscriber<T> {}
        class StringSubscriber extends Subscriber<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 36,
          endLine: 4,
          endColumn: 46
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 32,
          endLine: 5,
          endColumn: 42
        }
      ]
    },
    {
      code: stripIndent`
        import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject, Subscriber } from "rxjs";
        import { Scheduler } from "rxjs/internal/Scheduler";

        class GenericAsyncSubject<T> extends AsyncSubject<T> {}
        class StringAsyncSubject extends AsyncSubject<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 38,
          endLine: 4,
          endColumn: 50
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 34,
          endLine: 5,
          endColumn: 46
        }
      ]
    },
    {
      code: stripIndent`
        import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject, Subscriber } from "rxjs";
        import { Scheduler } from "rxjs/internal/Scheduler";

        class GenericBehaviorSubject<T> extends BehaviorSubject<T> {}
        class StringBehaviorSubject extends BehaviorSubject<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 41,
          endLine: 4,
          endColumn: 56
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 37,
          endLine: 5,
          endColumn: 52
        }
      ]
    },
    {
      code: stripIndent`
        import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject, Subscriber } from "rxjs";
        import { Scheduler } from "rxjs/internal/Scheduler";

        class GenericReplaySubject<T> extends ReplaySubject<T> {}
        class StringReplaySubject extends ReplaySubject<string> {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 39,
          endLine: 4,
          endColumn: 52
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 35,
          endLine: 5,
          endColumn: 48
        }
      ]
    },
    {
      code: stripIndent`
        import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject, Subscriber } from "rxjs";
        import { Scheduler } from "rxjs/internal/Scheduler";

        class AnotherScheduler extends Scheduler {}
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 32,
          endLine: 4,
          endColumn: 41
        }
      ]
    }
  ]
});
