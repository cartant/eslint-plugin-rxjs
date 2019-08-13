/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-nested-subscribe");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-nested-subscribe", rule, {
  valid: [
    stripIndent`
      import { Observable } from "rxjs";

      of(47).subscribe(value => {
        console.log(value);
      })
    `,
    stripIndent`
      import { Observable } from "rxjs";

      of(47).subscribe({
        next: value => console.log(value),
        error: value => console.log(value),
        complete: value => console.log(value),
      })
    `,
    stripIndent`
      import { Observable } from "rxjs";

      const observableSubscribe = Observable.prototype.subscribe;
      expect(Observable.prototype.subscribe).to.equal(observableSubscribe);
    `
  ],
  invalid: [
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("foo").subscribe(
            value => of("bar").subscribe()
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 33
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("foo").subscribe({
            next: value => of("bar").subscribe()
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 30,
          endLine: 4,
          endColumn: 39
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("foo").subscribe({
            next(value) { of("bar").subscribe(); }
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 38
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("foo").subscribe(
            undefined,
            error => of("bar").subscribe()
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 24,
          endLine: 5,
          endColumn: 33
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("foo").subscribe({
          error: error => of("bar").subscribe()
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 38
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("foo").subscribe({
          error(error) { of("bar").subscribe(); }
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 28,
          endLine: 4,
          endColumn: 37
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("foo").subscribe(
          undefined,
          undefined,
          () => of("bar").subscribe()
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 19,
          endLine: 6,
          endColumn: 28
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("foo").subscribe({
          complete: () => of("bar").subscribe()
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 38
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";

        of("foo").subscribe({
          complete() { of("bar").subscribe(); }
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 35
        }
      ]
    }
  ]
});
