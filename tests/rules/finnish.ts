/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/finnish");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("finnish", rule, {
  invalid: [
    {
      code: stripIndent`
        // optional
        import { Observable, of } from "rxjs";

        const someOptionalObservable$: Observable<any> | undefined = of();

        const someOptionalObservable: Observable<any> | undefined = of();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 29,
        },
      ],
      options: [{}],
    },
    {
      code: stripIndent`
        // whitelist-angular
        import { Observable, of, Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}

        class Something {
          public somethingChanged: EventEmitter<any>;
          public canActivate(): Observable<any> { return of(); }
          public canActivateChild(): Observable<any> { return of(); }
          public canDeactivate(): Observable<any> { return of(); }
          public canLoad(): Observable<any> { return of(); }
          public intercept(): Observable<any> { return of(); }
          public resolve(): Observable<any> { return of(); }
          public validate(): Observable<any> { return of(); }
        }
      `,
      errors: [],
      options: [{}],
    },
    {
      code: stripIndent`
        // whitelist-explicit
        import { of, Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any>;
        const foreign = of(1);

        class SomeSubject<T> extends Subject<T> {}
        let someSubject: SomeSubject<any>;
        const finnish = of(1);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 9,
          column: 5,
          endLine: 9,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 7,
          endLine: 10,
          endColumn: 14,
        },
      ],
      options: [
        {
          names: {
            "^finnish$": true,
            "^foreign$": false,
          },
          types: {
            "^EventEmitter$": false,
            "^SomeSubject$": true,
          },
        },
      ],
    },
    {
      code: stripIndent`
        // whitelist-optional
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any> | undefined;

        class SomeSubject<T> extends Subject<T> {}
        let someSubject: SomeSubject<any> | undefined;
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 5,
          endLine: 8,
          endColumn: 16,
        },
      ],
      options: [
        {
          types: {
            "^EventEmitter$": false,
            "^SomeSubject$": true,
          },
        },
      ],
    },
    {
      code: stripIndent`
        // with-$
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);

        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey$: someObservable$ };
        const { someKey$ } = someObject;
        const { someKey$: someRenamedKey$ } = someObject;

        const someArray = [someObservable$];
        const [someElement$] = someArray;
        someArray.forEach(function (element$: Observable<any>): void {});
        someArray.forEach((element$: Observable<any>) => {});

        function someFunction$(someParam$: Observable<any>): Observable<any> { return someParam; }

        class SomeClass {
          someProperty$: Observable<any>;
          constructor (someParam$: Observable<any>) {}
          get someGetter$(): Observable<any> { throw new Error("Some error."); }
          set someSetter$(someParam$: Observable<any>) {}
          someMethod$(someParam$: Observable<any>): Observable<any> { return someParam; }
        }

        interface SomeInterface {
          someProperty$: Observable<any>;
          someMethod$(someParam$: Observable<any>): Observable<any>;
        }
      `,
      errors: [],
      options: [{}],
    },
    {
      code: stripIndent`
        // without-$
        import { Observable, of } from "rxjs";

        const someObservable = of(0);

        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
        const { someKey } = someObject;
        const { someKey: someRenamedKey } = someObject;

        const someArray = [someObservable];
        const [someElement] = someArray;
        someArray.forEach(function (element: Observable<any>): void {});
        someArray.forEach((element: Observable<any>) => {});

        function someFunction(someParam: Observable<any>): Observable<any> { return someParam; }

        class SomeClass {
          someProperty: Observable<any>;
          constructor (someParam: Observable<any>) {}
          get someGetter(): Observable<any> { throw new Error("Some error."); }
          set someSetter(someParam: Observable<any>) {}
          someMethod(someParam: Observable<any>): Observable<any> { return someParam; }
        }

        interface SomeInterface {
          someProperty: Observable<any>;
          someMethod(someParam: Observable<any>): Observable<any>;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 21,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 42,
          endLine: 7,
          endColumn: 49,
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 9,
          endLine: 8,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 18,
          endLine: 9,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 8,
          endLine: 12,
          endColumn: 19,
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 29,
          endLine: 13,
          endColumn: 36,
        },
        {
          messageId: "forbidden",
          line: 14,
          column: 20,
          endLine: 14,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 10,
          endLine: 16,
          endColumn: 22,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 23,
          endLine: 16,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 19,
          column: 3,
          endLine: 19,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 20,
          column: 16,
          endLine: 20,
          endColumn: 25,
        },
        {
          messageId: "forbidden",
          line: 21,
          column: 7,
          endLine: 21,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 7,
          endLine: 22,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 18,
          endLine: 22,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 3,
          endLine: 23,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 14,
          endLine: 23,
          endColumn: 23,
        },
        {
          messageId: "forbidden",
          line: 27,
          column: 3,
          endLine: 27,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 28,
          column: 3,
          endLine: 28,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 28,
          column: 14,
          endLine: 28,
          endColumn: 23,
        },
      ],
      options: [{}],
    },
    {
      code: stripIndent`
          // without-$-no-functions
          import { Observable, of } from "rxjs";

          const someObservable = of(0);

          const someEmptyObject = {};
          const someObject = { ...someEmptyObject, someKey: someObservable };
          const { someKey } = someObject;
          const { someKey: someRenamedKey } = someObject;

          const someArray = [someObservable];
          const [someElement] = someArray;
          someArray.forEach(function (element: Observable<any>): void {});
          someArray.forEach((element: Observable<any>) => {});

          function someFunction(someParam: Observable<any>): Observable<any> { return someParam; }

          class SomeClass {
            someProperty: Observable<any>;
            constructor (someParam: Observable<any>) {}
            get someGetter(): Observable<any> { throw new Error("Some error."); }
            set someSetter(someParam: Observable<any>) {}
            someMethod(someParam: Observable<any>): Observable<any> { return someParam; }
          }

          interface SomeInterface {
            someProperty: Observable<any>;
            someMethod(someParam: Observable<any>): Observable<any>;
          }
        `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 21,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 42,
          endLine: 7,
          endColumn: 49,
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 9,
          endLine: 8,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 18,
          endLine: 9,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 8,
          endLine: 12,
          endColumn: 19,
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 29,
          endLine: 13,
          endColumn: 36,
        },
        {
          messageId: "forbidden",
          line: 14,
          column: 20,
          endLine: 14,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 23,
          endLine: 16,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 19,
          column: 3,
          endLine: 19,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 20,
          column: 16,
          endLine: 20,
          endColumn: 25,
        },
        {
          messageId: "forbidden",
          line: 21,
          column: 7,
          endLine: 21,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 7,
          endLine: 22,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 18,
          endLine: 22,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 3,
          endLine: 23,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 14,
          endLine: 23,
          endColumn: 23,
        },
        {
          messageId: "forbidden",
          line: 27,
          column: 3,
          endLine: 27,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 28,
          column: 3,
          endLine: 28,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 28,
          column: 14,
          endLine: 28,
          endColumn: 23,
        },
      ],
      options: [
        {
          functions: false,
        },
      ],
    },
    {
      code: stripIndent`
          // without-$-no-methods
          import { Observable, of } from "rxjs";

          const someObservable = of(0);

          const someEmptyObject = {};
          const someObject = { ...someEmptyObject, someKey: someObservable };
          const { someKey } = someObject;
          const { someKey: someRenamedKey } = someObject;

          const someArray = [someObservable];
          const [someElement] = someArray;
          someArray.forEach(function (element: Observable<any>): void {});
          someArray.forEach((element: Observable<any>) => {});

          function someFunction(someParam: Observable<any>): Observable<any> { return someParam; }

          class SomeClass {
            someProperty: Observable<any>;
            constructor (someParam: Observable<any>) {}
            get someGetter(): Observable<any> { throw new Error("Some error."); }
            set someSetter(someParam: Observable<any>) {}
            someMethod(someParam: Observable<any>): Observable<any> { return someParam; }
          }

          interface SomeInterface {
            someProperty: Observable<any>;
            someMethod(someParam: Observable<any>): Observable<any>;
          }
        `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 21,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 42,
          endLine: 7,
          endColumn: 49,
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 9,
          endLine: 8,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 18,
          endLine: 9,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 8,
          endLine: 12,
          endColumn: 19,
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 29,
          endLine: 13,
          endColumn: 36,
        },
        {
          messageId: "forbidden",
          line: 14,
          column: 20,
          endLine: 14,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 10,
          endLine: 16,
          endColumn: 22,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 23,
          endLine: 16,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 19,
          column: 3,
          endLine: 19,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 20,
          column: 16,
          endLine: 20,
          endColumn: 25,
        },
        {
          messageId: "forbidden",
          line: 21,
          column: 7,
          endLine: 21,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 7,
          endLine: 22,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 18,
          endLine: 22,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 14,
          endLine: 23,
          endColumn: 23,
        },
        {
          messageId: "forbidden",
          line: 27,
          column: 3,
          endLine: 27,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 28,
          column: 14,
          endLine: 28,
          endColumn: 23,
        },
      ],
      options: [
        {
          methods: false,
        },
      ],
    },
    {
      code: stripIndent`
          // without-$-no-parameters
          import { Observable, of } from "rxjs";

          const someObservable = of(0);

          const someEmptyObject = {};
          const someObject = { ...someEmptyObject, someKey: someObservable };
          const { someKey } = someObject;
          const { someKey: someRenamedKey } = someObject;

          const someArray = [someObservable];
          const [someElement] = someArray;
          someArray.forEach(function (element: Observable<any>): void {});
          someArray.forEach((element: Observable<any>) => {});

          function someFunction(someParam: Observable<any>): Observable<any> { return someParam; }

          class SomeClass {
            someProperty: Observable<any>;
            constructor (someParam: Observable<any>) {}
            get someGetter(): Observable<any> { throw new Error("Some error."); }
            set someSetter(someParam: Observable<any>) {}
            someMethod(someParam: Observable<any>): Observable<any> { return someParam; }
          }

          interface SomeInterface {
            someProperty: Observable<any>;
            someMethod(someParam: Observable<any>): Observable<any>;
          }
        `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 21,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 42,
          endLine: 7,
          endColumn: 49,
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 9,
          endLine: 8,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 18,
          endLine: 9,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 8,
          endLine: 12,
          endColumn: 19,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 10,
          endLine: 16,
          endColumn: 22,
        },
        {
          messageId: "forbidden",
          line: 19,
          column: 3,
          endLine: 19,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 21,
          column: 7,
          endLine: 21,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 7,
          endLine: 22,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 3,
          endLine: 23,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 27,
          column: 3,
          endLine: 27,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 28,
          column: 3,
          endLine: 28,
          endColumn: 13,
        },
      ],
      options: [
        {
          parameters: false,
        },
      ],
    },
    {
      code: stripIndent`
          // without-$-no-properties
          import { Observable, of } from "rxjs";

          const someObservable = of(0);

          const someEmptyObject = {};
          const someObject = { ...someEmptyObject, someKey: someObservable };
          const { someKey } = someObject;
          const { someKey: someRenamedKey } = someObject;

          const someArray = [someObservable];
          const [someElement] = someArray;
          someArray.forEach(function (element: Observable<any>): void {});
          someArray.forEach((element: Observable<any>) => {});

          function someFunction(someParam: Observable<any>): Observable<any> { return someParam; }

          class SomeClass {
            someProperty: Observable<any>;
            constructor (someParam: Observable<any>) {}
            get someGetter(): Observable<any> { throw new Error("Some error."); }
            set someSetter(someParam: Observable<any>) {}
            someMethod(someParam: Observable<any>): Observable<any> { return someParam; }
          }

          interface SomeInterface {
            someProperty: Observable<any>;
            someMethod(someParam: Observable<any>): Observable<any>;
          }
        `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 21,
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 9,
          endLine: 8,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 18,
          endLine: 9,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 8,
          endLine: 12,
          endColumn: 19,
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 29,
          endLine: 13,
          endColumn: 36,
        },
        {
          messageId: "forbidden",
          line: 14,
          column: 20,
          endLine: 14,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 10,
          endLine: 16,
          endColumn: 22,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 23,
          endLine: 16,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 20,
          column: 16,
          endLine: 20,
          endColumn: 25,
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 18,
          endLine: 22,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 3,
          endLine: 23,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 14,
          endLine: 23,
          endColumn: 23,
        },
        {
          messageId: "forbidden",
          line: 28,
          column: 3,
          endLine: 28,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 28,
          column: 14,
          endLine: 28,
          endColumn: 23,
        },
      ],
      options: [
        {
          properties: false,
        },
      ],
    },
    {
      code: stripIndent`
          // without-$-no-variables
          import { Observable, of } from "rxjs";

          const someObservable = of(0);

          const someEmptyObject = {};
          const someObject = { ...someEmptyObject, someKey: someObservable };
          const { someKey } = someObject;
          const { someKey: someRenamedKey } = someObject;

          const someArray = [someObservable];
          const [someElement] = someArray;
          someArray.forEach(function (element: Observable<any>): void {});
          someArray.forEach((element: Observable<any>) => {});

          function someFunction(someParam: Observable<any>): Observable<any> { return someParam; }

          class SomeClass {
            someProperty: Observable<any>;
            constructor (someParam: Observable<any>) {}
            get someGetter(): Observable<any> { throw new Error("Some error."); }
            set someSetter(someParam: Observable<any>) {}
            someMethod(someParam: Observable<any>): Observable<any> { return someParam; }
          }

          interface SomeInterface {
            someProperty: Observable<any>;
            someMethod(someParam: Observable<any>): Observable<any>;
          }
        `,
      errors: [
        {
          messageId: "forbidden",
          line: 7,
          column: 42,
          endLine: 7,
          endColumn: 49,
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 29,
          endLine: 13,
          endColumn: 36,
        },
        {
          messageId: "forbidden",
          line: 14,
          column: 20,
          endLine: 14,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 10,
          endLine: 16,
          endColumn: 22,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 23,
          endLine: 16,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 19,
          column: 3,
          endLine: 19,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 20,
          column: 16,
          endLine: 20,
          endColumn: 25,
        },
        {
          messageId: "forbidden",
          line: 21,
          column: 7,
          endLine: 21,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 7,
          endLine: 22,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 22,
          column: 18,
          endLine: 22,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 3,
          endLine: 23,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 23,
          column: 14,
          endLine: 23,
          endColumn: 23,
        },
        {
          messageId: "forbidden",
          line: 27,
          column: 3,
          endLine: 27,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 28,
          column: 3,
          endLine: 28,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 28,
          column: 14,
          endLine: 28,
          endColumn: 23,
        },
      ],
      options: [
        {
          variables: false,
        },
      ],
    },
  ],
});
