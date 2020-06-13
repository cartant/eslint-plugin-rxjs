/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
    fromFixture(
      stripIndent`
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden]
          value => console.log(value),
          error => console.log(error)
        );
        source.subscribe(
               ~~~~~~~~~ [forbidden]
          value => console.log(value),
          error => console.log(error),
          () => console.log("complete")
        );
        source.subscribe(
               ~~~~~~~~~ [forbidden]
          value => console.log(value),
          undefined,
          () => console.log("complete")
        );
        source.subscribe(
               ~~~~~~~~~ [forbidden]
          undefined,
          error => console.log(error)
        );
        source.subscribe(
               ~~~~~~~~~ [forbidden]
          undefined,
          error => console.log(error),
          () => console.log("complete")
        );
        source.subscribe(
               ~~~~~~~~~ [forbidden]
          undefined,
          undefined,
          () => console.log("complete")
        );

        source.pipe(tap(
                    ~~~ [forbidden]
          value => console.log(value),
          error => console.log(error)
        )).subscribe();
        source.pipe(tap(
                    ~~~ [forbidden]
          value => console.log(value),
          error => console.log(error),
          () => console.log("complete")
        )).subscribe();
        source.pipe(tap(
                    ~~~ [forbidden]
          value => console.log(value),
          undefined,
          () => console.log("complete")
        )).subscribe();
        source.pipe(tap(
                    ~~~ [forbidden]
          undefined,
          error => console.log(error)
        )).subscribe();
        source.pipe(tap(
                    ~~~ [forbidden]
          undefined,
          error => console.log(error),
          () => console.log("complete")
        )).subscribe();
        source.pipe(tap(
                    ~~~ [forbidden]
          undefined,
          undefined,
          () => console.log("complete")
        )).subscribe();
      `
    ),
    fromFixture(
      stripIndent`
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden]
          value => console.log(value)
        );

        source.pipe(tap(
                    ~~~ [forbidden]
          value => console.log(value)
        )).subscribe();
      `,
      {},
      { options: [{ allowNext: false }] }
    ),
    fromFixture(
      stripIndent`
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe(nextArrow);
               ~~~~~~~~~ [forbidden]
        source.subscribe(nextNamed);
               ~~~~~~~~~ [forbidden]
        source.subscribe(nextNonArrow);
               ~~~~~~~~~ [forbidden]

        source.pipe(tap(nextArrow));
                    ~~~ [forbidden]
        source.pipe(tap(nextNamed));
                    ~~~ [forbidden]
        source.pipe(tap(nextNonArrow));
                    ~~~ [forbidden]
      `,
      {},
      { options: [{ allowNext: false }] }
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden]
          function (value) { console.log(value); },
          function (error) { console.log(error); }
        );
        source.subscribe(
               ~~~~~~~~~ [forbidden]
          function (value) { console.log(value); },
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        );
        source.subscribe(
               ~~~~~~~~~ [forbidden]
          function (value) { console.log(value); },
          undefined,
          function () { console.log("complete"); }
        );
        source.subscribe(
               ~~~~~~~~~ [forbidden]
          undefined,
          function (error) { console.log(error); }
        );
        source.subscribe(
               ~~~~~~~~~ [forbidden]
          undefined,
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        );
        source.subscribe(
               ~~~~~~~~~ [forbidden]
          undefined,
          undefined,
          function () { console.log("complete"); }
        );

        source.pipe(tap(
                    ~~~ [forbidden]
          function (value) { console.log(value); },
          function (error) { console.log(error); }
        )).subscribe();
        source.pipe(tap(
                    ~~~ [forbidden]
          function (value) { console.log(value); },
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        )).subscribe();
        source.pipe(tap(
                    ~~~ [forbidden]
          function (value) { console.log(value); },
          undefined,
          function () { console.log("complete"); }
        )).subscribe();
        source.pipe(tap(
                    ~~~ [forbidden]
          undefined,
          function (error) { console.log(error); }
        )).subscribe();
        source.pipe(tap(
                    ~~~ [forbidden]
          undefined,
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        )).subscribe();
        source.pipe(tap(
                    ~~~ [forbidden]
          undefined,
          undefined,
          function () { console.log("complete"); }
        )).subscribe();
      `
    ),
  ],
});
