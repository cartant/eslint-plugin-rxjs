/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-tap");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-tap", rule, {
  valid: [
    stripIndent`
      // no tap
      import { of } from "rxjs";
      import { map } from "rxjs/operators";
      const ob = of(1).pipe(
        map(x => x * 2)
      );
    `
  ],
  invalid: [
    {
      code: stripIndent`
        // tap
        import { of } from "rxjs";
        import { map, tap } from "rxjs/operators";
        const ob = of(1).pipe(
          map(x => x * 2),
          tap(value => console.log(value))
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 18
        }
      ]
    },
    {
      code: stripIndent`
        // tap alias
        import { of } from "rxjs";
        import { map, tap as tapAlias } from "rxjs/operators";
        const ob = of(1).pipe(
          map(x => x * 2),
          tapAlias(value => console.log(value))
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 18
        }
      ]
    }
  ]
});
