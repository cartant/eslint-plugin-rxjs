/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import * as eslint from "eslint";
import rule = require("../../source/rules/no-unbound-methods");
import { ruleTester } from "../utils";

interface Tests {
  valid?: (string | eslint.RuleTester.ValidTestCase)[];
  invalid?: eslint.RuleTester.InvalidTestCase[];
}

const arrowTests: Tests = {
  valid: [
    stripIndent`
      // arrows
      import { NEVER, Observable, of, Subscription, throwError } from "rxjs";
      import { catchError, map, takeUntil } from "rxjs/operators";

      const userland = <T>(selector: (t: T) => T) => map(selector);

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            map(value => this.map(value)),
            userland(value => this.map(value)),
            takeUntil(this.someObservable),
            catchError(error => this.catchError(error))
          ).subscribe(
            value => this.next(value),
            error => this.error(error),
            () => this.complete()
          );
          const subscription = new Subscription(() => this.tearDown);
          subscription.add(() => this.tearDown);
        }
        catchError(error: any): Observable<never> { return throwError(error); }
        complete(): void {}
        error(error: any): void {}
        map<T>(t: T): T { return t; }
        next<T>(t: T): void {}
        tearDown(): void {}
      }
    `,
  ],
  invalid: [],
};

const boundTests: Tests = {
  valid: [
    stripIndent`
      // bound
      import { NEVER, Observable, of, Subscription, throwError } from "rxjs";
      import { catchError, map, takeUntil } from "rxjs/operators";

      const userland = <T>(selector: (t: T) => T) => map(selector);

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            map(this.map.bind(this)),
            userland(this.map.bind(this)),
            takeUntil(this.someObservable),
            catchError(this.catchError.bind(this))
          ).subscribe(
            this.next.bind(this),
            this.error.bind(this),
            this.complete.bind(this)
          );
          const subscription = new Subscription(this.tearDown.bind(this));
          subscription.add(this.tearDown.bind(this));
        }
        catchError(error: any): Observable<never> { return throwError(error); }
        complete(): void {}
        error(error: any): void {}
        map<T>(t: T): T { return t; }
        next<T>(t: T): void {}
        tearDown(): void {}
      }
    `,
  ],
  invalid: [],
};

const deepTests: Tests = {
  valid: [],
  invalid: [
    {
      code: stripIndent`
        // deep
        import { Observable, of, throwError, NEVER } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        const userland = <T>(selector: (t: T) => T) => map(selector);

        class Something {
          deep = {
            catchError(error: any): Observable<never> { return throwError(error); },
            complete(): void {},
            error(error: any): void {},
            map<T>(t: T): T { return t; },
            next<T>(t: T): void {},
          }
          someObservable = NEVER;
          constructor() {
            const ob = of(1).pipe(
              map(this.deep.map),
              userland(this.deep.map),
              takeUntil(this.someObservable), // no error
              catchError(this.deep.catchError)
            ).subscribe(
              this.deep.next,
              this.deep.error,
              this.deep.complete
            );
          }
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 18,
          column: 11,
          endLine: 18,
          endColumn: 24,
        },
        {
          messageId: "forbidden",
          line: 19,
          column: 16,
          endLine: 19,
          endColumn: 29,
        },
        {
          messageId: "forbidden",
          line: 21,
          column: 18,
          endLine: 21,
          endColumn: 38,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 7,
          endLine: 23,
          endColumn: 21,
        },
        {
          messageId: "forbidden",
          line: 24,
          column: 7,
          endLine: 24,
          endColumn: 22,
        },
        {
          messageId: "forbidden",
          line: 25,
          column: 7,
          endLine: 25,
          endColumn: 25,
        },
      ],
    },
    {
      code: stripIndent`
        // deep teardowns
        import { Subscription } from "rxjs";
        import { takeUntil } from "rxjs/operators";

        class Something {
          deep = {
            tearDown(): void {}
          }
          constructor() {
            const subscription = new Subscription(this.deep.tearDown);
            subscription.add(this.deep.tearDown);
          }
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 10,
          column: 43,
          endLine: 10,
          endColumn: 61,
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 22,
          endLine: 11,
          endColumn: 40,
        },
      ],
    },
  ],
};

const staticTests: Tests = {
  valid: [
    stripIndent`
      // static
      import { NEVER, Observable, of, Subscription, throwError } from "rxjs";
      import { catchError, map, takeUntil } from "rxjs/operators";

      const userland = <T>(selector: (t: T) => T) => map(selector);

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            map(Something.map),
            userland(Something.map),
            takeUntil(this.someObservable),
            catchError(Something.catchError)
          ).subscribe(
            Something.next,
            Something.error,
            Something.complete
          );
          const subscription = new Subscription(Something.tearDown);
          subscription.add(Something.tearDown);
        }
        static catchError(error: any): Observable<never> { return throwError(error); }
        static complete(): void {}
        static error(error: any): void {}
        static map<T>(t: T): T { return t; }
        static next<T>(t: T): void {}
        static tearDown(): void {}
      }
    `,
  ],
  invalid: [],
};

const unboundTests: Tests = {
  valid: [
    stripIndent`
      // unbound observable
      import { NEVER, of } from "rxjs";
      import { takeUntil } from "rxjs/operators";

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            takeUntil(this.someObservable),
          ).subscribe(console.log);
        }
      }
    `,
  ],
  invalid: [
    {
      code: stripIndent`
        // unbound operator arguments
        import { Observable, of, throwError } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        const userland = <T>(selector: (t: T) => T) => map(selector);

        class Something {
          constructor() {
            const ob = of(1).pipe(
              map(this.map),
              userland(this.map),
              catchError(this.catchError)
            )
          }
          map<T>(t: T): T { return t; }
          catchError(error: any): Observable<never> { return throwError(error); }
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 10,
          column: 11,
          endLine: 10,
          endColumn: 19,
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 16,
          endLine: 11,
          endColumn: 24,
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 18,
          endLine: 12,
          endColumn: 33,
        },
      ],
    },
    {
      code: stripIndent`
        // unbound subscribe arguments
        import { of } from "rxjs";

        class Something {
          constructor() {
            const ob = of(1).subscribe(
              this.next,
              this.error,
              this.complete,
            );
          }
          next<T>(t: T): void {}
          error(error: any): void {}
          complete(): void {}
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 7,
          column: 7,
          endLine: 7,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 7,
          endLine: 8,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 7,
          endLine: 9,
          endColumn: 20,
        },
      ],
    },
    {
      code: stripIndent`
        // unbound teardowns
        import { Subscription } from "rxjs";

        class Something {
          constructor() {
            const subscription = new Subscription(this.tearDown);
            subscription.add(this.tearDown);
          }
          tearDown(): void {}
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 43,
          endLine: 6,
          endColumn: 56,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 35,
        },
      ],
    },
  ],
};

ruleTester({ types: true }).run("no-unbound-methods", rule, {
  valid: [
    ...arrowTests.valid,
    ...boundTests.valid,
    ...deepTests.valid,
    ...staticTests.valid,
    ...unboundTests.valid,
  ],
  invalid: [
    ...arrowTests.invalid,
    ...boundTests.invalid,
    ...deepTests.invalid,
    ...staticTests.invalid,
    ...unboundTests.invalid,
  ],
});
