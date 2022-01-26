/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/suffix-subjects");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("suffix-subjects", rule, {
  valid: [
    {
      code: stripIndent`
      // with default suffix
      import { Subject } from "rxjs";

      const subject = new Subject<any>();
      const someSubject = new Subject<any>();

      const someObject = {
        subject: new Subject<any>(),
        someSubject: new Subject<any>()
      };

      function someFunction(
        subject: Subject<any>,
        someSubject: Subject<any>
      ) {
        console.log(subject, someSubject);
      }

      class SomeClass {
        subject = new Subject<any>();
        someSubject = new Subject<void>();

        constructor(private ctorSubject: Subject<any>) {}

        someMethod(someSubject: Subject<any>): Subject<any> {
          return someSubject;
        }

        get anotherSubject(): Subject<any> {
          return this.subject;
        }
        set anotherSubject(someSubject: Subject<any>) {
          this.someSubject = someSubject;
        }
      }

      interface SomeInterface {
        subject: Subject<any>;
        someSubject: Subject<any>;
        someMethod(someSubject: Subject<any>): Subject<any>;
        new (someSubject: Subject<any>);
        (someSubject: Subject<any>): void;
      }
    `,
      options: [{}],
    },
    {
      code: stripIndent`
      // with default suffix and $
      import { Subject } from "rxjs";

      const subject$ = new Subject<any>();
      const someSubject$ = new Subject<any>();

      const someObject = {
        subject$: new Subject<any>(),
        someSubject$: new Subject<any>()
      };

      function someFunction(
        subject$: Subject<any>,
        someSubject$: Subject<any>
      ) {
        console.log(subject$, someSubject$);
      }

      class SomeClass {
        subject$ = new Subject<any>();
        someSubject$ = new Subject<void>();

        constructor(private ctorSubject$: Subject<any>) {}

        someMethod(someSubject$: Subject<any>): Subject<any> {
          return someSubject$;
        }

        get anotherSubject$(): Subject<any> {
          return this.subject$;
        }
        set anotherSubject$(someSubject$: Subject<any>) {
          this.someSubject$ = someSubject$;
        }
      }

      interface SomeInterface {
        subject$: Subject<any>;
        someSubject$: Subject<any>;
        someMethod(someSubject$: Subject<any>): Subject<any>;
        new (someSubject$: Subject<any>);
        (someSubject$: Subject<any>): void;
      }
    `,
      options: [{}],
    },
    {
      code: stripIndent`
      // with explicit suffix
      import { Subject } from "rxjs";

      const sub = new Subject<any>();
      const someSub = new Subject<any>();

      const someObject = {
        sub: new Subject<any>(),
        someSub: new Subject<any>()
      };

      function someFunction(
        sub: Subject<any>,
        someSub: Subject<any>
      ) {
        console.log(sub, someSub);
      }

      class SomeClass {
        sub = new Subject<any>();
        someSub = new Subject<void>();

        constructor(private ctorSub: Subject<any>) {}

        someMethod(someSub: Subject<any>): Subject<any> {
          return someSub;
        }

        get anotherSub(): Subject<any> {
          return this.sub;
        }
        set anotherSub(someSub: Subject<any>) {
          this.someSub = someSub;
        }
      }

      interface SomeInterface {
        sub: Subject<any>;
        someSub: Subject<any>;
        someMethod(someSub: Subject<any>): Subject<any>;
        new (someSub: Subject<any>);
        (someSub: Subject<any>): void;
      }
    `,
      options: [{ suffix: "Sub" }],
    },
    {
      code: stripIndent`
      // with explicit suffix and $
      import { Subject } from "rxjs";

      const sub$ = new Subject<any>();
      const someSub$ = new Subject<any>();

      const someObject = {
        sub$: new Subject<any>(),
        someSub$: new Subject<any>()
      };

      function someFunction(
        sub$: Subject<any>,
        someSub$: Subject<any>
      ) {
        console.log(sub$, someSub$);
      }

      class SomeClass {
        sub$ = new Subject<any>();
        someSub$ = new Subject<void>();

        constructor(private ctorSub$: Subject<any>) {}

        someMethod(someSub$: Subject<any>): Subject<any> {
          return someSub$;
        }

        get anotherSub$(): Subject<any> {
          return this.sub$;
        }
        set anotherSub$(someSub$: Subject<any>) {
          this.someSub$ = someSub$;
        }
      }

      interface SomeInterface {
        sub$: Subject<any>;
        someSub$: Subject<any>;
        someMethod(someSub$: Subject<any>): Subject<any>;
        new (someSub$: Subject<any>);
        (someSub$: Subject<any>): void;

      }
    `,
      options: [{ suffix: "Sub" }],
    },
    {
      code: stripIndent`
      // with EventEmitter
      import { Subject } from "rxjs";

      class EventEmitter<T> extends Subject<T> {}
      const emitter = new EventEmitter<any>();
    `,
      options: [{}],
    },
    {
      code: stripIndent`
      // with explicit non-enforced type
      import { Subject } from "rxjs";

      class Thing<T> extends Subject<T> {}
      const thing = new Thing<any>();
    `,
      options: [
        {
          types: {
            "^Thing$": false,
          },
        },
      ],
    },
    {
      code: stripIndent`
        // https://github.com/cartant/rxjs-tslint-rules/issues/88
        import { RouterStateSerializer } from '@ngrx/router-store';
        import { Params, RouterStateSnapshot } from '@angular/router';

        /**
         * The RouterStateSerializer takes the current RouterStateSnapshot
         * and returns any pertinent information needed. The snapshot contains
         * all information about the state of the router at the given point in time.
         * The entire snapshot is complex and not always needed. In this case, you only
         * need the URL and query parameters from the snapshot in the store. Other items could be
         * returned such as route parameters and static route data.
         */
        export interface RouterStateUrl {
          url: string;
          queryParams: Params;
        }

        export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
          serialize(routerState: RouterStateSnapshot): RouterStateUrl {
            const { url } = routerState;
            const queryParams = routerState.root.queryParams;

            return { url, queryParams };
          }
        }
      `,
    },
    {
      code: stripIndent`
        // variables without suffix, but not enforced
        import { Subject } from "rxjs";

        const one = new Subject<any>();
        const some = new Subject<any>();
      `,
      options: [{ variables: false }],
    },
    {
      code: stripIndent`
        // BehaviorSubject with default suffix
        import { BehaviorSubject } from "rxjs";

        const subject = new BehaviorSubject<number>(42);
        const someSubject = new BehaviorSubject<number>(54);
      `,
    },
    {
      code: stripIndent`
        // MySubject with default suffix
        import { Subject } from "rxjs";
        class MySubject extends Subject {}

        const subject = new MySubject<number>();
        const mySubject = new MySubject<number>();
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // parameters without suffix
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          ~~~ [forbidden { "suffix": "Subject" }]
          some: Subject<any>
          ~~~~ [forbidden { "suffix": "Subject" }]
        ) {
          console.log(one, some);
        }

        class SomeClass {
          constructor(ctor: Subject<any>) {}
                      ~~~~ [forbidden { "suffix": "Subject" }]

          someMethod(some: Subject<any>): Subject<any> {
                     ~~~~ [forbidden { "suffix": "Subject" }]
            return some;
          }

          get another(): Subject<any> {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
            return this.ctor;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
                      ~~~~ [forbidden { "suffix": "Subject" }]
            this.ctor = some;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
                     ~~~~ [forbidden { "suffix": "Subject" }]
          new (some: Subject<any>);
               ~~~~ [forbidden { "suffix": "Subject" }]
          (some: Subject<any>): void;
           ~~~~ [forbidden { "suffix": "Subject" }]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // parameters without suffix, but not enforced
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          some: Subject<any>
        ) {
          console.log(one, some);
        }

        class SomeClass {
          constructor(ctor: Subject<any>) {}

          someMethod(some: Subject<any>): Subject<any> {
            return some;
          }

          get another(): Subject<any> {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
            return this.ctor;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
            this.ctor = some;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
          new (some: Subject<any>);
          (some: Subject<any>): void;
        }
      `,
      { options: [{ parameters: false }] }
    ),
    fromFixture(
      stripIndent`
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          ~~~ [forbidden { "suffix": "Sub" }]
          some: Subject<any>
          ~~~~ [forbidden { "suffix": "Sub" }]
        ) {
          console.log(one, some);
        }

        class SomeClass {
          constructor(ctor: Subject<any>) {}
                      ~~~~ [forbidden { "suffix": "Sub" }]

          someMethod(some: Subject<any>): Subject<any> {
                     ~~~~ [forbidden { "suffix": "Sub" }]
            return some;
          }

          get another(): Subject<any> {
              ~~~~~~~ [forbidden { "suffix": "Sub" }]
            return this.ctor;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden { "suffix": "Sub" }]
                      ~~~~ [forbidden { "suffix": "Sub" }]
            this.ctor = some;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
                     ~~~~ [forbidden { "suffix": "Sub" }]
          new (some: Subject<any>);
               ~~~~ [forbidden { "suffix": "Sub" }]
          (some: Subject<any>): void;
           ~~~~ [forbidden { "suffix": "Sub" }]
        }
      `,
      { options: [{ suffix: "Sub" }] }
    ),
    fromFixture(
      stripIndent`
        // properties without suffix
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          ~~~ [forbidden { "suffix": "Subject" }]
          some: new Subject<any>()
          ~~~~ [forbidden { "suffix": "Subject" }]
        };

        class SomeClass {
          one = new Subject<any>();
          ~~~ [forbidden { "suffix": "Subject" }]
          some = new Subject<void>();
          ~~~~ [forbidden { "suffix": "Subject" }]

          get another(): Subject<any> {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
            return this.subject;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
                      ~~~~ [forbidden { "suffix": "Subject" }]
            this.some = some;
          }
        }

        interface SomeInterface {
          one: Subject<any>;
          ~~~ [forbidden { "suffix": "Subject" }]
          some: Subject<any>;
          ~~~~ [forbidden { "suffix": "Subject" }]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // properties without suffix, but not enforced
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          some: new Subject<any>()
        };

        class SomeClass {
          one = new Subject<any>();
          some = new Subject<void>();

          get another(): Subject<any> {
            return this.subject;
          }
          set another(some: Subject<any>) {
                      ~~~~ [forbidden { "suffix": "Subject" }]
            this.some = some;
          }
        }

        interface SomeInterface {
          one: Subject<any>;
          some: Subject<any>;
        }
      `,
      { options: [{ properties: false }] }
    ),
    fromFixture(
      stripIndent`
        // properties without explicit suffix
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          ~~~ [forbidden { "suffix": "Sub" }]
          some: new Subject<any>()
          ~~~~ [forbidden { "suffix": "Sub" }]
        };

        class SomeClass {
          one = new Subject<any>();
          ~~~ [forbidden { "suffix": "Sub" }]
          some = new Subject<void>();
          ~~~~ [forbidden { "suffix": "Sub" }]

          get another(): Subject<any> {
              ~~~~~~~ [forbidden { "suffix": "Sub" }]
            return this.subject;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden { "suffix": "Sub" }]
                      ~~~~ [forbidden { "suffix": "Sub" }]
            this.some = some;
          }
        }

        interface SomeInterface {
          one: Subject<any>;
          ~~~ [forbidden { "suffix": "Sub" }]
          some: Subject<any>;
          ~~~~ [forbidden { "suffix": "Sub" }]
        }
      `,
      { options: [{ suffix: "Sub" }] }
    ),
    fromFixture(
      stripIndent`
        // variables without suffix
        import { Subject } from "rxjs";

        const one = new Subject<any>();
              ~~~ [forbidden { "suffix": "Subject" }]
        const some = new Subject<any>();
              ~~~~ [forbidden { "suffix": "Subject" }]
      `
    ),
    fromFixture(
      stripIndent`
        // variables without explicit suffix
        import { Subject } from "rxjs";

        const one = new Subject<any>();
              ~~~ [forbidden { "suffix": "Sub" }]
        const some = new Subject<any>();
              ~~~~ [forbidden { "suffix": "Sub" }]
      `,
      { options: [{ suffix: "Sub" }] }
    ),
    fromFixture(
      stripIndent`
        // functions and methods with array destructuring
        import { Subject } from "rxjs";

        function someFunction([someParam]: Subject<any>[]): void {}
                               ~~~~~~~~~ [forbidden { "suffix": "Subject" }]

        class SomeClass {
          someMethod([someParam]: Subject<any>[]): void {}
                      ~~~~~~~~~ [forbidden { "suffix": "Subject" }]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // functions and methods with object destructuring
        import { Subject } from "rxjs";

        function someFunction({ source }: Record<string, Subject<any>>): void {}
                                ~~~~~~ [forbidden { "suffix": "Subject" }]

        class SomeClass {
          someMethod({ source }: Record<string, Subject<any>>): void {}
                       ~~~~~~ [forbidden { "suffix": "Subject" }]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // parameter property
        import { Subject } from "rxjs";

        class SomeClass {
          constructor(public some: Subject<any>) {}
                             ~~~~ [forbidden { "suffix": "Subject" }]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // BehaviorSubject without suffix
        import { BehaviorSubject } from "rxjs";

        const source = new BehaviorSubject<number>(42);
              ~~~~~~ [forbidden { "suffix": "Subject" }]
      `
    ),
    fromFixture(
      stripIndent`
        // BehaviorSubject with $$ suffix
        // https://github.com/cartant/eslint-plugin-rxjs/issues/88
        import { BehaviorSubject } from "rxjs";

        const subject$ = new BehaviorSubject<number>(42);
              ~~~~~~~~ [forbidden { "suffix": "$$" }]
        const someSubject$ = new BehaviorSubject<number>(54);
              ~~~~~~~~~~~~ [forbidden { "suffix": "$$" }]
      `,
      { options: [{ suffix: "$$" }] }
    ),
    fromFixture(
      stripIndent`
        // Property with $$ suffix
        // https://github.com/cartant/eslint-plugin-rxjs/issues/88#issuecomment-1020645186
        import { Subject } from "rxjs";

        class SomeClass {
          public someProperty$: Subject<unknown>;
                 ~~~~~~~~~~~~~ [forbidden { "suffix": "$$" }]
        }
      `,
      { options: [{ suffix: "$$" }] }
    ),
    fromFixture(
      stripIndent`
        // MySubject without suffix
        import { Subject } from "rxjs";
        class MySubject<T> extends Subject<T> {}

        const source = new MySubject<number>();
              ~~~~~~ [forbidden { "suffix": "Subject" }]
      `
    ),
  ],
});
