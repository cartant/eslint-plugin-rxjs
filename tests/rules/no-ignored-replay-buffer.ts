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
      import { ReplaySubject } from "rxjs";

      const a = new ReplaySubject<string>(1);
    `,
    stripIndent`
      import { of } from "rxjs";
      import { publishReplay } from "rxjs/operators";

      const a = of(42).pipe(publishReplay(1));
    `,
    stripIndent`
      import { of } from "rxjs";
      import { shareReplay } from "rxjs/operators";

      const a = of(42).pipe(shareReplay(1));
    `,
    stripIndent`
      import { ReplaySubject } from "rxjs";

      const a = new Thing(new ReplaySubject<number>(1));
    `,
    stripIndent`
      import * as Rx from "rxjs";

      const a = new Rx.ReplaySubject<string>(1);
    `,
    stripIndent`
      import * as Rx from "rxjs";
      import { publishReplay } from "rxjs/operators";

      const a = Rx.of(42).pipe(publishReplay(1));
    `,
    stripIndent`
      import * as Rx from "rxjs";
      import { shareReplay } from "rxjs/operators";

      const a = Rx.of(42).pipe(shareReplay(1));
    `,
    stripIndent`
      import * as Rx from "rxjs";

      const a = new Thing(new Rx.ReplaySubject<number>(1));
    `
  ],
  invalid: [
    {
      code: stripIndent`
        import { ReplaySubject } from "rxjs";

        const a = new ReplaySubject<string>();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 28
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = of(42).pipe(publishReplay());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 36
        }
      ]
    },
    {
      code: stripIndent`
        import { of } from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = of(42).pipe(shareReplay());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 34
        }
      ]
    },
    {
      code: stripIndent`
        import { ReplaySubject } from "rxjs";

        const a = new Thing(new ReplaySubject<number>());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 38
        }
      ]
    },
    {
      code: stripIndent`
        import * as Rx from "rxjs";

        const a = new Rx.ReplaySubject<string>();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 18,
          endLine: 3,
          endColumn: 31
        }
      ]
    },
    {
      code: stripIndent`
        import * as Rx from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(publishReplay());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 39
        }
      ]
    },
    {
      code: stripIndent`
        import * as Rx from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(shareReplay());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 37
        }
      ]
    },
    {
      code: stripIndent`
        import * as Rx from "rxjs";

        const a = new Thing(new Rx.ReplaySubject<number>());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 28,
          endLine: 3,
          endColumn: 41
        }
      ]
    }
  ]
});
