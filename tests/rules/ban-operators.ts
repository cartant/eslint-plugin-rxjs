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
    {
      code: `import { concat, merge as m, mergeMap as mm } from "rxjs";`,
    },
    {
      // This won't effect errors, because only imports from "rxjs/operators"
      // are checked. To support banning operators from "rxjs", it'll need to
      // check types.
      code: `import { concat, merge as m, mergeMap as mm } from "rxjs";`,
      options: [
        {
          concat: true,
          merge: "because I say so",
          mergeMap: false,
        },
      ],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { concat, merge as m, mergeMap as mm } from "rxjs/operators";
                 ~~~~~~ [forbidden { "name": "concat", "explanation": "" }]
                         ~~~~~ [forbidden { "name": "merge", "explanation": ": because I say so" }]
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
