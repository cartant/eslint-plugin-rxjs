/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-async-subscribe");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-async-subscribe", rule, {
  valid: [
    stripIndent`
      // sync arrow function
      import { of } from "rxjs";

      of("a").subscribe(() => {});
    `,
    stripIndent`
      // sync function
      import { of } from "rxjs";

      of("a").subscribe(function() {});
    `,
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/46
      import React from "react";
      import { SomeComponent } from "some";
      const element = <SomeComponent />;
    `,
  ],
  invalid: [
    {
      code: stripIndent`
        // async arrow function
        import { of } from "rxjs";

        of("a").subscribe(async () => {
          return await "a";
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 23,
        },
      ],
    },
    {
      code: stripIndent`
        // async function
        import { of } from "rxjs";

        of("a").subscribe(async function() {
          return await "a";
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 23,
        },
      ],
    },
  ],
});
