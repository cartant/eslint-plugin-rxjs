/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import * as eslint from "eslint";
import rule = require("../../source/rules/no-unbound-method");
import { ruleTester } from "../utils";

interface Tests {
  valid?: (string | eslint.RuleTester.ValidTestCase)[];
  invalid?: eslint.RuleTester.InvalidTestCase[];
}

const arrowTests: Tests = {
  valid: [
    stripIndent`
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
    `
  ],
  invalid: []
};

const boundTests: Tests = {
  valid: [
    stripIndent`
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
    `
  ],
  invalid: []
};

const deepTests: Tests = {
  valid: [],
  invalid: [
    {
      code: stripIndent`
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
          line: 17,
          column: 17,
          endLine: 17,
          endColumn: 30
        },
        {
          messageId: "forbidden",
          line: 18,
          column: 22,
          endLine: 18,
          endColumn: 35
        },
        {
          messageId: "forbidden",
          line: 20,
          column: 24,
          endLine: 20,
          endColumn: 44
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 13,
          endLine: 22,
          endColumn: 27
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 13,
          endLine: 23,
          endColumn: 28
        },
        {
          messageId: "forbidden",
          line: 24,
          column: 13,
          endLine: 24,
          endColumn: 31
        }
      ]
    },
    {
      code: stripIndent`
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
          line: 9,
          column: 47,
          endLine: 9,
          endColumn: 65
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 26,
          endLine: 10,
          endColumn: 44
        }
      ]
    }
  ]
};

const staticTests: Tests = {
  valid: [
    stripIndent`
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
    `
  ],
  invalid: []
};

const unboundTests: Tests = {
  valid: [
    stripIndent`
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
    `
  ],
  invalid: [
    {
      code: stripIndent`
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
          line: 9,
          column: 17,
          endLine: 9,
          endColumn: 25
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 22,
          endLine: 10,
          endColumn: 30
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 24,
          endLine: 11,
          endColumn: 39
        }
      ]
    },
    {
      code: stripIndent`
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
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 22
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 23
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 26
        }
      ]
    },
    {
      code: stripIndent`
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
          line: 5,
          column: 47,
          endLine: 5,
          endColumn: 60
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 26,
          endLine: 6,
          endColumn: 39
        }
      ]
    }
  ]
};

ruleTester({ types: true }).run("no-unbound-method", rule, {
  valid: [
    ...arrowTests.valid,
    ...boundTests.valid,
    ...deepTests.valid,
    ...staticTests.valid,
    ...unboundTests.valid
  ],
  invalid: [
    ...arrowTests.invalid,
    ...boundTests.invalid,
    ...deepTests.invalid,
    ...staticTests.invalid,
    ...unboundTests.invalid
  ]
});
