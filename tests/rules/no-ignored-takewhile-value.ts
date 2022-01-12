/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/75
      import {
        equals,
        takeWhile,
        toPairs,
      } from 'remeda'

      return takeWhile(
        sizesAsArray,
        ([_, width]) => w.innerWidth >= width,
      )
    `,
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/93
      import { Observable } from "rxjs";
      import { takeWhile } from "rxjs/operators";

      class Something {
        constructor(private _source: Observable<{ name: string }>) {
          _source.pipe(
            takeWhile(({ name }) => name)
          ).subscribe();
        }
      };
    `,
    stripIndent`
      // Array destructuring
      import { Observable } from "rxjs";
      import { takeWhile } from "rxjs/operators";

      class Something {
        constructor(private _source: Observable<string[]>) {
          _source.pipe(
            takeWhile(([name]) => name)
          ).subscribe();
        }
      };
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // function without value
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(function (value) { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `
    ),
    fromFixture(
      stripIndent`
        // function without parameter
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(function () { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `
    ),
    fromFixture(
      stripIndent`
        // arrow function without value
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(value => false)
                        ~~~~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `
    ),
    fromFixture(
      stripIndent`
        // arrow function without parameter
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(() => false)
                        ~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `
    ),
    fromFixture(
      stripIndent`
        // arrow function with block without value
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(value => { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `
    ),
    fromFixture(
      stripIndent`
        // arrow function with block without parameter
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(() => { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `
    ),
  ],
});
