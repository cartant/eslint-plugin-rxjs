/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/ban-observables");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("ban-observables", rule, {
  valid: [
    {
      code: `import { of, Observable } from "rxjs";`,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { of, Observable as o, Subject } from "rxjs";
                 ~~ [forbidden]
                     ~~~~~~~~~~ [forbidden]
      `,
      {},
      {
        options: [
          {
            of: true,
            Observable: "because I say so",
            Subject: false,
          },
        ],
      }
    ),
  ],
});
