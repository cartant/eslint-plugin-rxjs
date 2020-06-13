/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-explicit-generics");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-explicit-generics", rule, {
  valid: [
    {
      code: stripIndent`
        // without type arguments
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
        const h = new Notification<number>("C");`,
    },
    {
      code: stripIndent`
        // with array and object literals
        import { BehaviorSubject, Notification } from "rxjs";
        const a = new BehaviorSubject<number[]>([42]);
        const b = new BehaviorSubject<number[]>([]);
        const c = new BehaviorSubject<{ answer: number }>({ answer: 42 });
        const d = new BehaviorSubject<{ answer?: number }>({});
        const e = new Notification<number[]>("N", [42]);
        const f = new Notification<number[]>("N", []);
        const g = new Notification<{ answer: number }>("N", { answer: 42 });
        const h = new Notification<{ answer?: number }>("N", {});
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // scan with type arguments
        const a = of(42, 54);
        const b = a.pipe(
          scan<number, string>((acc, value) => acc + value, "")
          ~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        const b = new BehaviorSubject<number>(42);
                      ~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        const f = from<number>([42, 54]);
                  ~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
      const o = of<number>(42, 54);
                ~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
      const n = new Notification<number>("N", 42);
                    ~~~~~~~~~~~~ [forbidden]
      `
    ),
  ],
});
