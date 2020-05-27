/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/prefer-observer");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("prefer-observer", rule, {
  valid: [
    {
      code: stripIndent`
        // allow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
          value => console.log(value)
        );

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          next: value => console.log(value)
        });

        source.pipe(tap(
          value => console.log(value)
        )).subscribe();

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
      `,
      options: [{ allowNext: true }],
    },
    {
      code: stripIndent`
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe();
        source.subscribe(
          value => console.log(value)
        );

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          error(error) { console.log(error); }
        });
        source.subscribe({
          complete() { console.log("complete"); }
        });
        source.subscribe({
          next(value) { console.log(value); },
          error(error) { console.log(error); },
          complete() { console.log("complete"); }
        });

        source.subscribe({
          next: value => console.log(value)
        });
        source.subscribe({
          error: error => console.log(error)
        });
        source.subscribe({
          complete: () => console.log("complete")
        });
        source.subscribe({
          next: value => console.log(value),
          error: error => console.log(error),
          complete: () => console.log("complete")
        });

        source.pipe(tap(
          value => console.log(value)
        )).subscribe();

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          error(error) { console.log(error); }
        })).subscribe();
        source.pipe(tap({
          complete() { console.log("complete"); }
        })).subscribe();
        source.pipe(tap({
          next(value) { console.log(value); },
          error(error) { console.log(error); },
          complete() { console.log("complete"); }
        })).subscribe();

        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
        source.pipe(tap({
          error: error => console.log(error)
        })).subscribe();
        source.pipe(tap({
          complete: () => console.log("complete")
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value),
          error: error => console.log(error),
          complete: () => console.log("complete")
        })).subscribe();
      `,
      options: [{}],
    },
    {
      code: stripIndent`
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          next: value => console.log(value)
        });

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
      `,
      options: [{ allowNext: false }],
    },
    {
      code: stripIndent`
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextObserver = {
          next: (value: number) => { console.log(value); }
        };
        const source = of(42);

        source.subscribe(nextObserver);
        source.pipe(tap(nextObserver));
      `,
      options: [{}],
    },
    {
      code: stripIndent`
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe();
        source.subscribe(
          function (value) { console.log(value); }
        );
        source.pipe(tap(
          function (value) { console.log(value); }
        )).subscribe();
      `,
      options: [{}],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
          value => console.log(value),
          error => console.log(error)
        );
        source.subscribe(
          value => console.log(value),
          error => console.log(error),
          () => console.log("complete")
        );
        source.subscribe(
          value => console.log(value),
          undefined,
          () => console.log("complete")
        );
        source.subscribe(
          undefined,
          error => console.log(error)
        );
        source.subscribe(
          undefined,
          error => console.log(error),
          () => console.log("complete")
        );
        source.subscribe(
          undefined,
          undefined,
          () => console.log("complete")
        );

        source.pipe(tap(
          value => console.log(value),
          error => console.log(error)
        )).subscribe();
        source.pipe(tap(
          value => console.log(value),
          error => console.log(error),
          () => console.log("complete")
        )).subscribe();
        source.pipe(tap(
          value => console.log(value),
          undefined,
          () => console.log("complete")
        )).subscribe();
        source.pipe(tap(
          undefined,
          error => console.log(error)
        )).subscribe();
        source.pipe(tap(
          undefined,
          error => console.log(error),
          () => console.log("complete")
        )).subscribe();
        source.pipe(tap(
          undefined,
          undefined,
          () => console.log("complete")
        )).subscribe();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 7,
          column: 8,
          endLine: 7,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 8,
          endLine: 11,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 8,
          endLine: 16,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 21,
          column: 8,
          endLine: 21,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 25,
          column: 8,
          endLine: 25,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 30,
          column: 8,
          endLine: 30,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 36,
          column: 13,
          endLine: 36,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 40,
          column: 13,
          endLine: 40,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 45,
          column: 13,
          endLine: 45,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 50,
          column: 13,
          endLine: 50,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 54,
          column: 13,
          endLine: 54,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 59,
          column: 13,
          endLine: 59,
          endColumn: 16,
        },
      ],
      options: [{}],
    },
    {
      code: stripIndent`
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
          value => console.log(value)
        );

        source.pipe(tap(
          value => console.log(value)
        )).subscribe();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 7,
          column: 8,
          endLine: 7,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 13,
          endLine: 11,
          endColumn: 16,
        },
      ],
      options: [{ allowNext: false }],
    },
    {
      code: stripIndent`
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe(nextArrow);
        source.subscribe(nextNamed);
        source.subscribe(nextNonArrow);

        source.pipe(tap(nextArrow));
        source.pipe(tap(nextNamed));
        source.pipe(tap(nextNonArrow));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 11,
          column: 8,
          endLine: 11,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 12,
          column: 8,
          endLine: 12,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 13,
          column: 8,
          endLine: 13,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 15,
          column: 13,
          endLine: 15,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 13,
          endLine: 16,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 17,
          column: 13,
          endLine: 17,
          endColumn: 16,
        },
      ],
      options: [{ allowNext: false }],
    },
    {
      code: stripIndent`
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
          function (value) { console.log(value); },
          function (error) { console.log(error); }
        );
        source.subscribe(
          function (value) { console.log(value); },
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        );
        source.subscribe(
          function (value) { console.log(value); },
          undefined,
          function () { console.log("complete"); }
        );
        source.subscribe(
          undefined,
          function (error) { console.log(error); }
        );
        source.subscribe(
          undefined,
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        );
        source.subscribe(
          undefined,
          undefined,
          function () { console.log("complete"); }
        );

        source.pipe(tap(
          function (value) { console.log(value); },
          function (error) { console.log(error); }
        )).subscribe();
        source.pipe(tap(
          function (value) { console.log(value); },
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        )).subscribe();
        source.pipe(tap(
          function (value) { console.log(value); },
          undefined,
          function () { console.log("complete"); }
        )).subscribe();
        source.pipe(tap(
          undefined,
          function (error) { console.log(error); }
        )).subscribe();
        source.pipe(tap(
          undefined,
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        )).subscribe();
        source.pipe(tap(
          undefined,
          undefined,
          function () { console.log("complete"); }
        )).subscribe();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 7,
          column: 8,
          endLine: 7,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 11,
          column: 8,
          endLine: 11,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 16,
          column: 8,
          endLine: 16,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 21,
          column: 8,
          endLine: 21,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 25,
          column: 8,
          endLine: 25,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 30,
          column: 8,
          endLine: 30,
          endColumn: 17,
        },
        {
          messageId: "forbidden",
          line: 36,
          column: 13,
          endLine: 36,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 40,
          column: 13,
          endLine: 40,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 45,
          column: 13,
          endLine: 45,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 50,
          column: 13,
          endLine: 50,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 54,
          column: 13,
          endLine: 54,
          endColumn: 16,
        },
        {
          messageId: "forbidden",
          line: 59,
          column: 13,
          endLine: 59,
          endColumn: 16,
        },
      ],
      options: [{}],
    },
  ],
});
