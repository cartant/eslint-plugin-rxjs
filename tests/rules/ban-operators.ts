/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/ban-operators");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("ban-operators", rule, {
  valid: [
    {
      code: `import { concat, merge as m, mergeMap as mm } from "rxjs/operators";`,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { concat, merge as m, mergeMap as mm } from "rxjs/operators";
                 ~~~~~~ [forbidden]
                         ~~~~~ [forbidden]
      `,
      {
        options: [
          {
            concat: true,
            merge: "because I say so",
            mergeMap: false,
          },
        ],
      }
    ),
  ],
});
