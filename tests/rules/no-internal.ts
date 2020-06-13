/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-internal");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-internal", rule, {
  valid: [
    stripIndent`
      // no internal double quote
      import { concat } from "rxjs";
      import { map } from "rxjs/operators";
    `,
    stripIndent`
      // no internal single quote
      import { concat } from 'rxjs';
      import { map } from 'rxjs/operators';
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // internal double quote
        import { concat } from "rxjs/internal/observable/concat";
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        import { map } from "rxjs/internal/operators/map";
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // internal single quote
        import { concat } from 'rxjs/internal/observable/concat';
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        import { map } from 'rxjs/internal/operators/map';
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
  ],
});
