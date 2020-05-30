/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-finnish");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-finnish", rule, {
  valid: [
    stripIndent`
      // without $
      import { Observable, of } from "rxjs";

      const someObservable = of(0);
      const someObject = { someKey: someObservable };
      const { someKey: anotherObservable } = someObject;
      const [{ someKey: yetAnotherObservable }] = [someObject];

      const someEmptyObject = {};
      const someOtherObject = { ...someEmptyObject, someKey: someObservable };
      const { someKey } = someOtherObject;
      const { someKey: someRenamedKey } = someOtherObject;

      const someArray = [someObservable];
      const [someElement] = someArray;
      someArray.forEach(function (element: Observable<any>): void {});
      someArray.forEach((element: Observable<any>) => {});

      function someFunction(someParam: Observable<any>): Observable<any> { return someParam; }
      const someArrowFunction = (someParam: Observable<any>): Observable<any> => someParam;

      class SomeClass {
        someProperty: Observable<any>;
        constructor(someParam: Observable<any>) {}
        get someGetter(): Observable<any> { throw new Error("Some error."); }
        set someSetter(someParam: Observable<any>) {}
        someMethod(someParam: Observable<any>): Observable<any> { return someParam; }
      }

      interface SomeInterface {
        someProperty: Observable<any>;
        someMethod(someParam: Observable<any>): Observable<any>;
        new (someParam: Observable<any>);
        (someParam: Observable<any>): void;
      }
    `,
  ],
  invalid: [
    {
      code: stripIndent`
        // variables with $
        import { Observable, of } from "rxjs";
        const someObservable$ = of(0);
        const someObject = { someKey$: someObservable$ };
        const { someKey$ } = someObject;
        const { someKey$: anotherObservable$ } = someObject;
        const [{ someKey$: yetAnotherObservable$ }] = [someObject];
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 22,
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 30,
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 19,
          endLine: 6,
          endColumn: 37,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 20,
          endLine: 7,
          endColumn: 41,
        },
      ],
    },
    {
      code: stripIndent`
        // objects with $
        import { Observable, of } from "rxjs";
        const someObservable$ = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey$: someObservable$ };
        const { someKey$ } = someObject;
        const { someKey$: someRenamedKey$ } = someObject;
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 22,
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 42,
          endLine: 5,
          endColumn: 50,
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 19,
          endLine: 7,
          endColumn: 34,
        },
      ],
    },
    {
      code: stripIndent`
        // arrays with $
        import { Observable, of } from "rxjs";
        const someObservable$ = of(0);
        const someArray = [someObservable$];
        const [someElement$] = someArray;
        someArray.forEach(function (element$: Observable<any>): void {});
        someArray.forEach((element$: Observable<any>) => {});
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 22,
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 8,
          endLine: 5,
          endColumn: 20,
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 29,
          endLine: 6,
          endColumn: 37,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 20,
          endLine: 7,
          endColumn: 28,
        },
      ],
    },
    {
      code: stripIndent`
        // functions with $
        import { Observable } from "rxjs";
        function someFunction$(someParam$: Observable<any>): Observable<any> { return someParam$; }
        const someArrowFunction$ = (someParam$: Observable<any>): Observable<any> => someParam$;
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 10,
          endLine: 3,
          endColumn: 23,
        },
        {
          messageId: "forbidden",
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 34,
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 25,
        },
        {
          messageId: "forbidden",
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 39,
        },
      ],
    },
    {
      code: stripIndent`
        // class with $
        import { Observable } from "rxjs";
        class SomeClass {
          someProperty$: Observable<any>;
          constructor(someParam$: Observable<any>) {}
          get someGetter$(): Observable<any> { throw new Error("Some error."); }
          set someSetter$(someParam$: Observable<any>) {}
          someMethod$(someParam$: Observable<any>): Observable<any> { return someParam; }
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 25,
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 18,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 7,
          endLine: 7,
          endColumn: 18,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 19,
          endLine: 7,
          endColumn: 29,
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 3,
          endLine: 8,
          endColumn: 14,
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 15,
          endLine: 8,
          endColumn: 25,
        },
      ],
    },
    {
      code: stripIndent`
        // interface with $
        import { Observable } from "rxjs";
        interface SomeInterface {
          someProperty$: Observable<any>;
          someMethod$(someParam$: Observable<any>): Observable<any>;
          new (someParam$: Observable<any>);
          (someParam$: Observable<any>): void;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 14,
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 25,
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 8,
          endLine: 6,
          endColumn: 18,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 4,
          endLine: 7,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        function someFunction(someParam$: Observable<any>): void {}

        class SomeClass {
          someMethod(someParam$: Observable<any>): void {}
        }

        interface SomeInterface {
          someMethod(someParam$: Observable<any>): void;
          (someParam$: Observable<any>): void;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 33,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 14,
          endLine: 7,
          endColumn: 24,
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 14,
          endLine: 11,
          endColumn: 24,
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 4,
          endLine: 12,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // functions and methods with non-observable parameters
        import { Observable, of } from "rxjs";

        function someFunction$(someValue: any): Observable<any> { return of(someValue); }

        class SomeClass {
          someMethod$(someValue: any): Observable<any> { return of(someValue); }
        }

        interface SomeInterface {
          someMethod$(someValue: any): Observable<any>;
          (someValue: any): Observable<any>;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 10,
          endLine: 4,
          endColumn: 23,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 3,
          endLine: 7,
          endColumn: 14,
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 3,
          endLine: 11,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // functions and methods with array destructuring
        import { Observable } from "rxjs";

        function someFunction([someParam$]: Observable<any>[]): void {}

        class SomeClass {
          someMethod([someParam$]: Observable<any>[]): void {}
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 34,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 25,
        },
      ],
    },
  ],
});
