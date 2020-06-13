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
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // parameters without suffix
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          ~~~ [forbidden]
          some: Subject<any>
          ~~~~ [forbidden]
        ) {
          console.log(one, some);
        }

        class SomeClass {
          constructor(ctor: Subject<any>) {}
                      ~~~~ [forbidden]

          someMethod(some: Subject<any>): Subject<any> {
                     ~~~~ [forbidden]
            return some;
          }

          get another(): Subject<any> {
              ~~~~~~~ [forbidden]
            return this.ctor;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden]
                      ~~~~ [forbidden]
            this.ctor = some;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
                     ~~~~ [forbidden]
          new (some: Subject<any>);
               ~~~~ [forbidden]
          (some: Subject<any>): void;
           ~~~~ [forbidden]
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
              ~~~~~~~ [forbidden]
            return this.ctor;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden]
            this.ctor = some;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
          new (some: Subject<any>);
          (some: Subject<any>): void;
        }
      `,
      {},
      { options: [{ parameters: false }] }
    ),
    fromFixture(
      stripIndent`
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          ~~~ [forbidden]
          some: Subject<any>
          ~~~~ [forbidden]
        ) {
          console.log(one, some);
        }

        class SomeClass {
          constructor(ctor: Subject<any>) {}
                      ~~~~ [forbidden]

          someMethod(some: Subject<any>): Subject<any> {
                     ~~~~ [forbidden]
            return some;
          }

          get another(): Subject<any> {
              ~~~~~~~ [forbidden]
            return this.ctor;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden]
                      ~~~~ [forbidden]
            this.ctor = some;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
                     ~~~~ [forbidden]
          new (some: Subject<any>);
               ~~~~ [forbidden]
          (some: Subject<any>): void;
           ~~~~ [forbidden]
        }
      `,
      {},
      { options: [{ suffix: "Sub" }] }
    ),
    fromFixture(
      stripIndent`
        // properties without suffix
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          ~~~ [forbidden]
          some: new Subject<any>()
          ~~~~ [forbidden]
        };

        class SomeClass {
          one = new Subject<any>();
          ~~~ [forbidden]
          some = new Subject<void>();
          ~~~~ [forbidden]

          get another(): Subject<any> {
              ~~~~~~~ [forbidden]
            return this.subject;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden]
                      ~~~~ [forbidden]
            this.some = some;
          }
        }

        interface SomeInterface {
          one: Subject<any>;
          ~~~ [forbidden]
          some: Subject<any>;
          ~~~~ [forbidden]
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
                      ~~~~ [forbidden]
            this.some = some;
          }
        }

        interface SomeInterface {
          one: Subject<any>;
          some: Subject<any>;
        }
      `,
      {},
      { options: [{ properties: false }] }
    ),
    fromFixture(
      stripIndent`
        // properties without explicit suffix
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          ~~~ [forbidden]
          some: new Subject<any>()
          ~~~~ [forbidden]
        };

        class SomeClass {
          one = new Subject<any>();
          ~~~ [forbidden]
          some = new Subject<void>();
          ~~~~ [forbidden]

          get another(): Subject<any> {
              ~~~~~~~ [forbidden]
            return this.subject;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden]
                      ~~~~ [forbidden]
            this.some = some;
          }
        }

        interface SomeInterface {
          one: Subject<any>;
          ~~~ [forbidden]
          some: Subject<any>;
          ~~~~ [forbidden]
        }
      `,
      {},
      { options: [{ suffix: "Sub" }] }
    ),
    fromFixture(
      stripIndent`
        // variables without suffix
        import { Subject } from "rxjs";

        const one = new Subject<any>();
              ~~~ [forbidden]
        const some = new Subject<any>();
              ~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // variables without suffix, but not enforced
        import { Subject } from "rxjs";

        const one = new Subject<any>();
        const some = new Subject<any>();
      `,
      {},
      { options: [{ variables: false }] }
    ),
    fromFixture(
      stripIndent`
        // variables without explicit suffix
        import { Subject } from "rxjs";

        const one = new Subject<any>();
              ~~~ [forbidden]
        const some = new Subject<any>();
              ~~~~ [forbidden]
      `,
      {},
      { options: [{ suffix: "Sub" }] }
    ),
    fromFixture(
      stripIndent`
        // functions and methods with array destructuring
        import { Subject } from "rxjs";

        function someFunction([someParam]: Subject<any>[]): void {}
                               ~~~~~~~~~ [forbidden]

        class SomeClass {
          someMethod([someParam]: Subject<any>[]): void {}
                      ~~~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // functions and methods with object destructuring
        import { Subject } from "rxjs";

        function someFunction({ source }: Record<string, Subject<any>>): void {}
                                ~~~~~~ [forbidden]

        class SomeClass {
          someMethod({ source }: Record<string, Subject<any>>): void {}
                       ~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // parameter property
        import { Subject } from "rxjs";

        class SomeClass {
          constructor(public some: Subject<any>) {}
                             ~~~~ [forbidden]
        }
      `
    ),
  ],
});
