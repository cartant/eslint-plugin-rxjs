/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
    fromFixture(
      stripIndent`
        // variables with $
        import { Observable, of } from "rxjs";
        const someObservable$ = of(0);
              ~~~~~~~~~~~~~~~ [forbidden]
        const someObject = { someKey$: someObservable$ };
                             ~~~~~~~~ [forbidden]
        const { someKey$ } = someObject;
                ~~~~~~~~ [forbidden]
        const { someKey$: anotherObservable$ } = someObject;
                          ~~~~~~~~~~~~~~~~~~ [forbidden]
        const [{ someKey$: yetAnotherObservable$ }] = [someObject];
                           ~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // objects with $
        import { Observable, of } from "rxjs";
        const someObservable$ = of(0);
              ~~~~~~~~~~~~~~~ [forbidden]
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey$: someObservable$ };
                                                 ~~~~~~~~ [forbidden]
        const { someKey$ } = someObject;
                ~~~~~~~~ [forbidden]
        const { someKey$: someRenamedKey$ } = someObject;
                          ~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // arrays with $
        import { Observable, of } from "rxjs";
        const someObservable$ = of(0);
              ~~~~~~~~~~~~~~~ [forbidden]
        const someArray = [someObservable$];
        const [someElement$] = someArray;
               ~~~~~~~~~~~~ [forbidden]
        someArray.forEach(function (element$: Observable<any>): void {});
                                    ~~~~~~~~ [forbidden]
        someArray.forEach((element$: Observable<any>) => {});
                           ~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // functions with $
        import { Observable } from "rxjs";
        function someFunction$(someParam$: Observable<any>): Observable<any> { return someParam$; }
                 ~~~~~~~~~~~~~ [forbidden]
                               ~~~~~~~~~~ [forbidden]
        const someArrowFunction$ = (someParam$: Observable<any>): Observable<any> => someParam$;
              ~~~~~~~~~~~~~~~~~~ [forbidden]
                                    ~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // class with $
        import { Observable } from "rxjs";
        class SomeClass {
          someProperty$: Observable<any>;
          ~~~~~~~~~~~~~ [forbidden]
          constructor(someParam$: Observable<any>) {}
                      ~~~~~~~~~~ [forbidden]
          get someGetter$(): Observable<any> { throw new Error("Some error."); }
              ~~~~~~~~~~~ [forbidden]
          set someSetter$(someParam$: Observable<any>) {}
              ~~~~~~~~~~~ [forbidden]
                          ~~~~~~~~~~ [forbidden]
          someMethod$(someParam$: Observable<any>): Observable<any> { return someParam; }
          ~~~~~~~~~~~ [forbidden]
                      ~~~~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // interface with $
        import { Observable } from "rxjs";
        interface SomeInterface {
          someProperty$: Observable<any>;
          ~~~~~~~~~~~~~ [forbidden]
          someMethod$(someParam$: Observable<any>): Observable<any>;
          ~~~~~~~~~~~ [forbidden]
                      ~~~~~~~~~~ [forbidden]
          new (someParam$: Observable<any>);
               ~~~~~~~~~~ [forbidden]
          (someParam$: Observable<any>): void;
           ~~~~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        function someFunction(someParam$: Observable<any>): void {}
                              ~~~~~~~~~~ [forbidden]

        class SomeClass {
          someMethod(someParam$: Observable<any>): void {}
                     ~~~~~~~~~~ [forbidden]
        }

        interface SomeInterface {
          someMethod(someParam$: Observable<any>): void;
                     ~~~~~~~~~~ [forbidden]
          (someParam$: Observable<any>): void;
           ~~~~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // functions and methods with non-observable parameters
        import { Observable, of } from "rxjs";

        function someFunction$(someValue: any): Observable<any> { return of(someValue); }
                 ~~~~~~~~~~~~~ [forbidden]

        class SomeClass {
          someMethod$(someValue: any): Observable<any> { return of(someValue); }
          ~~~~~~~~~~~ [forbidden]
        }

        interface SomeInterface {
          someMethod$(someValue: any): Observable<any>;
          ~~~~~~~~~~~ [forbidden]
          (someValue: any): Observable<any>;
        }
      `
    ),
    fromFixture(
      stripIndent`
        // functions and methods with array destructuring
        import { Observable } from "rxjs";

        function someFunction([someParam$]: Observable<any>[]): void {}
                               ~~~~~~~~~~ [forbidden]

        class SomeClass {
          someMethod([someParam$]: Observable<any>[]): void {}
                      ~~~~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // functions and methods with object destructuring
        import { Observable } from "rxjs";

        function someFunction({ source$ }: Record<string, Observable<any>>): void {}
                                ~~~~~~~ [forbidden]
        class SomeClass {
          someMethod({ source$ }: Record<string, Observable<any>>): void {}
                       ~~~~~~~ [forbidden]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // parameter property
        import { Observable } from "rxjs";

        class SomeClass {
          constructor(public someProp$: Observable<any>) {}
                             ~~~~~~~~~ [forbidden]
        }
      `
    ),
  ],
});
