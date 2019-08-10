/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-ignored-subscription");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-ignored-subscription", rule, {
  valid: [
    stripIndent`
      import { of } from "rxjs";

      const a = of(42).subscribe();
      a.add(of(42).subscribe());
    `,
    stripIndent`
      import { Subscription } from "rxjs";

      let b: Subscription;
      b = of(42).subscribe();
    `,
    stripIndent`
      import { of } from "rxjs";

      const c = [of(42).subscribe()];
    `,
    stripIndent`
      import { of } from "rxjs";

      const d = { subscription: of(42).subscribe() };
    `
  ],
  invalid: [
    {
      code: stripIndent`
        import { of } from "rxjs";

        of(42).subscribe();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 8,
          endLine: 3,
          endColumn: 17
        }
      ]
    },
    {
      code: stripIndent`
        import { Subject } from "rxjs";

        const s = new Subject<any>()
        s.subscribe();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 12
        }
      ]
    }
  ]
});
