/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
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
    {
      code: stripIndent`
        // value property
        import { BehaviorSubject } from "rxjs";
        const subject = new BehaviorSubject<number>(1);
        console.log(subject.value);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 26,
        },
      ],
    },
    {
      code: stripIndent`
        // getValue method
        import { BehaviorSubject } from "rxjs";
        const subject = new BehaviorSubject<number>(1);
        console.log(subject.getValue());
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 29,
        },
      ],
    },
  ],
});
