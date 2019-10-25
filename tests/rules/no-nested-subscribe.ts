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
      // not nested in next argument
      import { Observable } from "rxjs";
      of(47).subscribe(value => {
        console.log(value);
      })
    `,
    stripIndent`
      // not nested in observer properties
      import { Observable } from "rxjs";
      of(47).subscribe({
        next: value => console.log(value),
        error: value => console.log(value),
        complete: () => console.log(value)
      })
    `,
    stripIndent`
      // not nested in observer methods
      import { Observable } from "rxjs";
      of(47).subscribe({
        next(value) { console.log(value); },
        error(value) { console.log(value); },
        complete() { console.log(value); }
      })
    `,
    stripIndent`
      // prototype property
      import { Observable } from "rxjs";
      const observableSubscribe = Observable.prototype.subscribe;
      expect(Observable.prototype.subscribe).to.equal(observableSubscribe);
    `,
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/38
      import {of} from "rxjs";
      of(3).subscribe(result => {
        const test = result as boolean;
        if(test > 1) {
          console.log(test);
        }
      });
    `
  ],
  invalid: [
    {
      code: stripIndent`
        // nested in next argument
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
        // nested in next property
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
        // nested in next method
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
        // nested in error argument
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
        // nested in error property
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
        // nested in error method
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
        // nested in complete argument
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
        // nested in complete property
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
        // nested in complete method
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
