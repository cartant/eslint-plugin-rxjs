/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
    {
      code: stripIndent`
        // functions without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        function someFunction(someParam$: Observable<any>): Observable<any> { return someParam$; }
      `,
      options: [{ functions: false }],
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
      options: [{ methods: false }],
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
      options: [{ parameters: false }],
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
      options: [{ properties: false }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // optional variable without $
        import { Observable, of } from "rxjs";

        const someOptionalObservable: Observable<any> | undefined = of();
              ~~~~~~~~~~~~~~~~~~~~~~ [shouldBeFinnish]
      `
    ),
    fromFixture(
      stripIndent`
        // explicit whitelist
        import { of, Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any>;
        const foreign = of(1);

        class SomeSubject<T> extends Subject<T> {}
        let someSubject: SomeSubject<any>;
            ~~~~~~~~~~~ [shouldBeFinnish]
        const finnish = of(1);
              ~~~~~~~ [shouldBeFinnish]
      `,
      {
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
      }
    ),
    fromFixture(
      stripIndent`
        // explicit whitelist optional variable
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any> | undefined;

        class SomeSubject<T> extends Subject<T> {}
        let someSubject: SomeSubject<any> | undefined;
            ~~~~~~~~~~~ [shouldBeFinnish]
      `,
      {
        options: [
          {
            types: {
              "^EventEmitter$": false,
              "^SomeSubject$": true,
            },
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // functions without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        function someFunction(someParam$: Observable<any>): Observable<any> { return someParam$; }
                 ~~~~~~~~~~~~ [shouldBeFinnish]
      `
    ),
    fromFixture(
      stripIndent`
        // methods without $
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod(someParam$: Observable<any>): Observable<any> { return someParam$; }
          ~~~~~~~~~~ [shouldBeFinnish]
        }

        interface SomeInterface {
          someMethod(someParam$: Observable<any>): Observable<any>;
          ~~~~~~~~~~ [shouldBeFinnish]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        someArray.forEach(function (element: Observable<any>): void {});
                                    ~~~~~~~ [shouldBeFinnish]
        someArray.forEach((element: Observable<any>) => {});
                           ~~~~~~~ [shouldBeFinnish]

        function someFunction$(someParam: Observable<any>): Observable<any> { return someParam; }
                               ~~~~~~~~~ [shouldBeFinnish]

        class SomeClass {
          constructor(someParam: Observable<any>) {}
                      ~~~~~~~~~ [shouldBeFinnish]
          set someSetter$(someParam: Observable<any>) {}
                          ~~~~~~~~~ [shouldBeFinnish]
          someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
                      ~~~~~~~~~ [shouldBeFinnish]
        }

        interface SomeInterface {
          someMethod$(someParam: Observable<any>): Observable<any>;
                      ~~~~~~~~~ [shouldBeFinnish]
          new (someParam: Observable<any>);
               ~~~~~~~~~ [shouldBeFinnish]
          (someParam: Observable<any>): void;
           ~~~~~~~~~ [shouldBeFinnish]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // properties without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable$ };
                                                 ~~~~~~~ [shouldBeFinnish]

        class SomeClass {
          someProperty: Observable<any>;
          ~~~~~~~~~~~~ [shouldBeFinnish]
          get someGetter(): Observable<any> { throw new Error("Some error."); }
              ~~~~~~~~~~ [shouldBeFinnish]
          set someSetter(someParam$: Observable<any>) {}
              ~~~~~~~~~~ [shouldBeFinnish]
        }

        interface SomeInterface {
          someProperty: Observable<any>;
          ~~~~~~~~~~~~ [shouldBeFinnish]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // variables without $
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
              ~~~~~~~~~~~~~~ [shouldBeFinnish]
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
                                                 ~~~~~~~ [shouldBeFinnish]
        const { someKey } = someObject;
                ~~~~~~~ [shouldBeFinnish]
        const { someKey: someRenamedKey } = someObject;
                         ~~~~~~~~~~~~~~ [shouldBeFinnish]
        const someArray = [someObservable];
        const [someElement] = someArray;
               ~~~~~~~~~~~ [shouldBeFinnish]
      `
    ),
    fromFixture(
      stripIndent`
        // variables without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
                                                 ~~~~~~~ [shouldBeFinnish]
        const { someKey } = someObject;
        const { someKey: someRenamedKey } = someObject;
        const someArray = [someObservable];
        const [someElement] = someArray;
      `,
      { options: [{ variables: false }] }
    ),
    fromFixture(
      stripIndent`
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        function someFunction(someParam: Observable<any>): void {}
                              ~~~~~~~~~ [shouldBeFinnish]

        class SomeClass {
          someMethod(someParam: Observable<any>): void {}
                     ~~~~~~~~~ [shouldBeFinnish]
        }

        interface SomeInterface {
          someMethod(someParam: Observable<any>): void;
                     ~~~~~~~~~ [shouldBeFinnish]
          (someParam: Observable<any>): void;
           ~~~~~~~~~ [shouldBeFinnish]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // functions and methods with non-observable parameters
        import { Observable, of } from "rxjs";

        function someFunction(someValue: any): Observable<any> { return of(someValue); }
                 ~~~~~~~~~~~~ [shouldBeFinnish]

        class SomeClass {
          someMethod(someValue: any): Observable<any> { return of(someValue); }
          ~~~~~~~~~~ [shouldBeFinnish]
        }

        interface SomeInterface {
          someMethod(someValue: any): Observable<any>;
          ~~~~~~~~~~ [shouldBeFinnish]
          (someValue: any): Observable<any>;
        }
      `
    ),
    fromFixture(
      stripIndent`
        // functions and methods with array destructuring
        import { Observable } from "rxjs";

        function someFunction([someParam]: Observable<any>[]): void {}
                               ~~~~~~~~~ [shouldBeFinnish]

        class SomeClass {
          someMethod([someParam]: Observable<any>[]): void {}
                      ~~~~~~~~~ [shouldBeFinnish]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // functions and methods with object destructuring
        import { Observable } from "rxjs";

        function someFunction({ source }: Record<string, Observable<any>>): void {}
                                ~~~~~~ [shouldBeFinnish]

        class SomeClass {
          someMethod({ source }: Record<string, Observable<any>>): void {}
                       ~~~~~~ [shouldBeFinnish]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // parameter property
        import { Observable } from "rxjs";

        class SomeClass {
          constructor(public someProp: Observable<any>) {}
                             ~~~~~~~~ [shouldBeFinnish]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // non-Observable variable with $
        const answer$ = 42;
              ~~~~~~~ [shouldNotBeFinnish]
      `,
      { options: [{ strict: true }] }
    ),
  ],
});
