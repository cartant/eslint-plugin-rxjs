/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-ignored-takewhile-value");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-ignored-takewhile-value", rule, {
  valid: [
    stripIndent`
      // function
      import { Observable } from "rxjs";
      import { takeWhile } from "rxjs/operators";

      class Something {
        constructor(private _source: Observable<string>) {
          _source.pipe(
            takeWhile(function (value) { return value; })
          ).subscribe();
        }
      };
    `,
    stripIndent`
      // arrow function
      import { Observable } from "rxjs";
      import { takeWhile } from "rxjs/operators";

      class Something {
        constructor(private _source: Observable<string>) {
          _source.pipe(
            takeWhile(value => value)
          ).subscribe();
        }
      };
    `,
    stripIndent`
      // arrow function with block
      import { Observable } from "rxjs";
      import { takeWhile } from "rxjs/operators";

      class Something {
        constructor(private _source: Observable<string>) {
          _source.pipe(
            takeWhile(value => { return value; })
          ).subscribe();
        }
      };
    `,
  ],
  invalid: [
    {
      code: stripIndent`
        // function without value
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(function (value) { return false; })
            ).subscribe();
          }
        };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 17,
          endLine: 8,
          endColumn: 51,
        },
      ],
    },
    {
      code: stripIndent`
        // function without parameter
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(function () { return false; })
            ).subscribe();
          }
        };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 17,
          endLine: 8,
          endColumn: 46,
        },
      ],
    },
    {
      code: stripIndent`
        // arrow function without value
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(value => false)
            ).subscribe();
          }
        };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 17,
          endLine: 8,
          endColumn: 31,
        },
      ],
    },
    {
      code: stripIndent`
        // arrow function without parameter
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(() => false)
            ).subscribe();
          }
        };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 17,
          endLine: 8,
          endColumn: 28,
        },
      ],
    },
    {
      code: stripIndent`
        // arrow function with block without value
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(value => { return false; })
            ).subscribe();
          }
        };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 17,
          endLine: 8,
          endColumn: 43,
        },
      ],
    },
    {
      code: stripIndent`
        // arrow function with block without parameter
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(() => { return false; })
            ).subscribe();
          }
        };
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 17,
          endLine: 8,
          endColumn: 40,
        },
      ],
    },
  ],
});
