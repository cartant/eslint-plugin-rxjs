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
      import { of } from "rxjs";

      const a = of('a');
    `
  ],
  invalid: [
    {
      code: stripIndent`
        import { of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey$: someObservable$ };

        const { someKey$ } = someObject;

        const someArray = [someObservable$];
        const [someElement$] = someArray;
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 22
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 42,
          endLine: 5,
          endColumn: 50
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 17
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 8,
          endLine: 10,
          endColumn: 20
        }
      ]
    },
    {
      code: stripIndent`
        import { of, Observable } from "rxjs";

        const someObservable = of(0);

        const someArray = [someObservable];
        someArray.forEach(function (element$: Observable<any>): void {});
        someArray.forEach((element$: Observable<any>) => {});
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 29,
          endLine: 6,
          endColumn: 54
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 20,
          endLine: 7,
          endColumn: 45
        }
      ]
    },
    {
      code: stripIndent`
        import { Observable } from 'rxjs';
        function someFunction$(someParam$: Observable<any>): Observable<any> { return someParam; }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 23
        },
        {
          messageId: "forbidden",
          line: 2,
          column: 24,
          endLine: 2,
          endColumn: 51
        }
      ]
    },
    {
      code: stripIndent`
      import { Observable } from 'rxjs';

      class SomeClass {
        someProperty$: Observable<any>;

        constructor (someParam$: Observable<any>) {}

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
          endColumn: 16
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 16,
          endLine: 6,
          endColumn: 43
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 7,
          endLine: 8,
          endColumn: 18
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 7,
          endLine: 10,
          endColumn: 18
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 19,
          endLine: 10,
          endColumn: 46
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 3,
          endLine: 12,
          endColumn: 14
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 15,
          endLine: 12,
          endColumn: 42
        }
      ]
    },
    {
      code: stripIndent`
      import { Observable } from 'rxjs';

      interface SomeInterface {
        someProperty$: Observable<any>;
        someMethod$(someParam$: Observable<any>, abc$: () => Observable<any>): Observable<any>;
      }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 16
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 14
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 42
        }
      ]
    }
  ]
});
