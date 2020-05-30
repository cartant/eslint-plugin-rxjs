/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/finnish");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("finnish", rule, {
  valid: [
    {
      code: stripIndent`
        // with $
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
          new (someParam$: Observable<any>);
          (someParam$: Observable<any>): void;
        }
      `,
      options: [{}],
    },
    {
      code: stripIndent`
        // optional variable with $
        import { Observable, of } from "rxjs";

        const someOptionalObservable$: Observable<any> | undefined = of();
      `,
      options: [{}],
    },
    {
      code: stripIndent`
        // default angular whitelist
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
      options: [{}],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        // optional variable without $
        import { Observable, of } from "rxjs";

        const someOptionalObservable: Observable<any> | undefined = of();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 29,
        },
      ],
      options: [{}],
    },
    {
      code: stripIndent`
        // explicit whitelist
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
        // explicit whitelist optional variable
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
        // functions without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        function someFunction(someParam$: Observable<any>): Observable<any> { return someParam$; }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 10,
          endLine: 6,
          endColumn: 22,
        },
      ],
      options: [{}],
    },
    {
      code: stripIndent`
        // functions without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        function someFunction(someParam$: Observable<any>): Observable<any> { return someParam$; }
      `,
      errors: [],
      options: [{ functions: false }],
    },
    {
      code: stripIndent`
        // methods without $
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod(someParam$: Observable<any>): Observable<any> { return someParam$; }
        }

        interface SomeInterface {
          someMethod(someParam$: Observable<any>): Observable<any>;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 3,
          endLine: 9,
          endColumn: 13,
        },
      ],
      options: [{}],
    },
    {
      code: stripIndent`
        // methods without $, but not enforced
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod(someParam$: Observable<any>): Observable<any> { return someParam$; }
        }

        interface SomeInterface {
          someMethod(someParam$: Observable<any>): Observable<any>;
        }
      `,
      errors: [],
      options: [{ methods: false }],
    },
    {
      code: stripIndent`
        // parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        someArray.forEach(function (element: Observable<any>): void {});
        someArray.forEach((element: Observable<any>) => {});

        function someFunction$(someParam: Observable<any>): Observable<any> { return someParam; }

        class SomeClass {
          constructor(someParam: Observable<any>) {}
          set someSetter$(someParam: Observable<any>) {}
          someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
        }

        interface SomeInterface {
          someMethod$(someParam: Observable<any>): Observable<any>;
          new (someParam: Observable<any>);
          (someParam: Observable<any>): void;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 29,
          endLine: 6,
          endColumn: 36,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 20,
          endLine: 7,
          endColumn: 27,
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 24,
          endLine: 9,
          endColumn: 33,
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 15,
          endLine: 12,
          endColumn: 24,
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 19,
          endLine: 13,
          endColumn: 28,
        },
        {
          messageId: "forbidden",
          line: 14,
          column: 15,
          endLine: 14,
          endColumn: 24,
        },
        {
          messageId: "forbidden",
          line: 18,
          column: 15,
          endLine: 18,
          endColumn: 24,
        },
        {
          messageId: "forbidden",
          line: 19,
          column: 8,
          endLine: 19,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 20,
          column: 4,
          endLine: 20,
          endColumn: 13,
        },
      ],
      options: [{}],
    },
    {
      code: stripIndent`
        // parameters without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        someArray.forEach(function (element: Observable<any>): void {});
        someArray.forEach((element: Observable<any>) => {});

        function someFunction$(someParam: Observable<any>): Observable<any> { return someParam; }

        class SomeClass {
          constructor(someParam: Observable<any>) {}
          set someSetter$(someParam: Observable<any>) {}
          someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
        }

        interface SomeInterface {
          someMethod$(someParam: Observable<any>): Observable<any>;
          new (someParam$: Observable<any>);
          (someParam$: Observable<any>): void;
        }
      `,
      errors: [],
      options: [{ parameters: false }],
    },
    {
      code: stripIndent`
        // properties without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable$ };

        class SomeClass {
          someProperty: Observable<any>;
          get someGetter(): Observable<any> { throw new Error("Some error."); }
          set someSetter(someParam$: Observable<any>) {}
        }

        interface SomeInterface {
          someProperty: Observable<any>;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 42,
          endLine: 6,
          endColumn: 49,
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 3,
          endLine: 9,
          endColumn: 15,
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 7,
          endLine: 10,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 7,
          endLine: 11,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 15,
          column: 3,
          endLine: 15,
          endColumn: 15,
        },
      ],
      options: [{}],
    },
    {
      code: stripIndent`
        // properties without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable$ };

        class SomeClass {
          someProperty: Observable<any>;
          get someGetter(): Observable<any> { throw new Error("Some error."); }
          set someSetter(someParam$: Observable<any>) {}
        }

        interface SomeInterface {
          someProperty: Observable<any>;
        }
      `,
      errors: [],
      options: [{ properties: false }],
    },
    {
      code: stripIndent`
        // variables without $
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
        const { someKey } = someObject;
        const { someKey: someRenamedKey } = someObject;
        const someArray = [someObservable];
        const [someElement] = someArray;
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
          line: 6,
          column: 42,
          endLine: 6,
          endColumn: 49,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 18,
          endLine: 8,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 8,
          endLine: 10,
          endColumn: 19,
        },
      ],
      options: [{}],
    },
    {
      code: stripIndent`
        // variables without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
        const { someKey } = someObject;
        const { someKey: someRenamedKey } = someObject;
        const someArray = [someObservable];
        const [someElement] = someArray;
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 42,
          endLine: 6,
          endColumn: 49,
        },
      ],
      options: [{ variables: false }],
    },
    {
      code: stripIndent`
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        function someFunction(someParam: Observable<any>): void {}

        class SomeClass {
          someMethod(someParam: Observable<any>): void {}
        }

        interface SomeInterface {
          someMethod(someParam: Observable<any>): void;
          (someParam: Observable<any>): void;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 32,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 14,
          endLine: 7,
          endColumn: 23,
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 14,
          endLine: 11,
          endColumn: 23,
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 4,
          endLine: 12,
          endColumn: 13,
        },
      ],
      options: [{}],
    },
    {
      code: stripIndent`
        // functions and methods with non-observable parameters
        import { Observable, of } from "rxjs";

        function someFunction(someValue: any): Observable<any> { return of(someValue); }

        class SomeClass {
          someMethod(someValue: any): Observable<any> { return of(someValue); }
        }

        interface SomeInterface {
          someMethod(someValue: any): Observable<any>;
          (someValue: any): Observable<any>;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 10,
          endLine: 4,
          endColumn: 22,
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 3,
          endLine: 7,
          endColumn: 13,
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 3,
          endLine: 11,
          endColumn: 13,
        },
      ],
      options: [{}],
    },
  ],
});
