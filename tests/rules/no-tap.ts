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
      import { of } from "rxjs";
      import { map } from "rxjs/operators";

      const ob = of(1).pipe(
        map(x => x * 2),
        tap(value => console.log(value)),
        tapAlias(value => console.log(value))
      );
    `
  ],
  invalid: [
    {
      code: `import { tap } from "rxjs/operators";`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 13
        }
      ]
    },
    {
      code: `import { tap as tapAlias } from "rxjs/operators";`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 13
        }
      ]
    }
  ]
});
