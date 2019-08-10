/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import rule = require("../../source/rules/no-explicit-generics");
import { ruleTester } from "../utils";
import { stripIndent } from "common-tags";

ruleTester({ types: false }).run("no-explicit-generics", rule, {
  valid: [
    {
      code: stripIndent`
        import { BehaviorSubject, from, of, Notification } from "rxjs";
        import { scan } from "rxjs/operators";
        const a = of(42, 54);
        const b1 = a.pipe(
            scan((acc: string, value: number) => acc + value, "")
        );
        const b2 = a.pipe(
            scan((acc, value): string => acc + value, "")
        );
        const c = new BehaviorSubject(42);
        const d = from([42, 54]);
        const e = of(42, 54);
        const f = new Notification("N", 42);
        const g = new Notification<number>("E", undefined, "Kaboom!");
        const h = new Notification<number>("C");`
    }
  ],
  invalid: [
    {
      code: stripIndent`
        const a = of(42, 54);
        const b = a.pipe(
            scan<number, string>((acc, value) => acc + value, "")
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 5,
          endLine: 3,
          endColumn: 9
        }
      ]
    },
    {
      code: `const b = new BehaviorSubject<number>(42);`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: `const f = from<number>([42, 54]);`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 15
        }
      ]
    },
    {
      code: `const o = of<number>(42, 54);`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 13
        }
      ]
    },
    {
      code: `const n = new Notification<number>("N", 42);`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 27
        }
      ]
    }
  ]
});
