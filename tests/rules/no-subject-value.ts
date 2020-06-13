/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-subject-value");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-subject-value", rule, {
  valid: [
    stripIndent`
      // no value
      import { BehaviorSubject } from "rxjs";
      const subject = new BehaviorSubject<number>(1);
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // value property
        import { BehaviorSubject } from "rxjs";
        const subject = new BehaviorSubject<number>(1);
        console.log(subject.value);
                            ~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // getValue method
        import { BehaviorSubject } from "rxjs";
        const subject = new BehaviorSubject<number>(1);
        console.log(subject.getValue());
                            ~~~~~~~~ [forbidden]
      `
    ),
  ],
});
