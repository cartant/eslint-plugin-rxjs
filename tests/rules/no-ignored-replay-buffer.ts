/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-ignored-replay-buffer");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-ignored-replay-buffer", rule, {
  valid: [
    stripIndent`
      // ReplaySubject not ignored
      import { ReplaySubject } from "rxjs";

      const a = new ReplaySubject<string>(1);
      const b = new Thing(new ReplaySubject<number>(1));
    `,
    stripIndent`
      // publishReplay not ignored
      import { of } from "rxjs";
      import { publishReplay } from "rxjs/operators";

      const a = of(42).pipe(publishReplay(1));
    `,
    stripIndent`
      // shareReplay not ignored
      import { of } from "rxjs";
      import { shareReplay } from "rxjs/operators";

      const a = of(42).pipe(shareReplay(1));
    `,
    stripIndent`
      // namespace ReplaySubject not ignored
      import * as Rx from "rxjs";

      const a = new Rx.ReplaySubject<string>(1);
      const b = new Thing(new Rx.ReplaySubject<number>(1));
    `,
    stripIndent`
      // namespace publishReplay not ignored
      import * as Rx from "rxjs";
      import { publishReplay } from "rxjs/operators";

      const a = Rx.of(42).pipe(publishReplay(1));
    `,
    stripIndent`
      // namespace shareReplay not ignored
      import * as Rx from "rxjs";
      import { shareReplay } from "rxjs/operators";

      const a = Rx.of(42).pipe(shareReplay(1));
    `,
    stripIndent`
      // namespace class not ignored
      import * as Rx from "rxjs";

      class Mock {
        private valid: Rx.ReplaySubject<number>;
        constructor(){
          this.valid = new Rx.ReplaySubject<number>(1);
        }
      }
    `,
  ],
  invalid: [
    {
      code: stripIndent`
        // ReplaySubject ignored
        import { ReplaySubject } from "rxjs";

        const a = new ReplaySubject<string>();
        const b = new Thing(new ReplaySubject<number>());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 28,
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 38,
        },
      ],
    },
    {
      code: stripIndent`
        // publishReplay ignored
        import { of } from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = of(42).pipe(publishReplay());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 36,
        },
      ],
    },
    {
      code: stripIndent`
        // shareReplay ignored
        import { of } from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = of(42).pipe(shareReplay());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 34,
        },
      ],
    },
    {
      code: stripIndent`
        // namespace ReplaySubject ignored
        import * as Rx from "rxjs";

        const a = new Rx.ReplaySubject<string>();
        const b = new Thing(new Rx.ReplaySubject<number>());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 31,
        },
        {
          messageId: "forbidden",
          line: 5,
          column: 28,
          endLine: 5,
          endColumn: 41,
        },
      ],
    },
    {
      code: stripIndent`
        // namespace publishReplay ignored
        import * as Rx from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(publishReplay());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 26,
          endLine: 5,
          endColumn: 39,
        },
      ],
    },
    {
      code: stripIndent`
        // namespace shareReplay ignored
        import * as Rx from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(shareReplay());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 26,
          endLine: 5,
          endColumn: 37,
        },
      ],
    },
    {
      code: stripIndent`
        // namespace class ignored
        import * as Rx from "rxjs";

        class Mock {
          private invalid: Rx.ReplaySubject<number>;
          constructor(){
            this.invalid = new Rx.ReplaySubject<number>();
          }
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 7,
          column: 27,
          endLine: 7,
          endColumn: 40,
        },
      ],
    },
  ],
});
