/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-sharereplay");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-sharereplay", rule, {
  valid: [
    {
      code: stripIndent`
        // config allowed refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: true })
        );`,
      options: [{ allowConfig: true }],
    },
    {
      code: stripIndent`
        // config allowed no refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: false })
        );`,
      options: [{ allowConfig: true }],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        // no arguments
        const shared = of(42).pipe(
          shareReplay()
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // config allowed no arguments
        const shared = of(42).pipe(
          shareReplay()
        );`,
      options: [{ allowConfig: true }],
      errors: [
        {
          messageId: "forbiddenWithoutConfig",
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // one argument
        const shared = of(42).pipe(
          shareReplay(1)
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // two arguments
        const shared = of(42).pipe(
          shareReplay(1, 100)
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // three arguments
        const shared = of(42).pipe(
          shareReplay(1, 100, asapScheduler)
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // config argument refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: true })
        );`,
      options: [{ allowConfig: false }],
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
        },
      ],
    },
    {
      code: stripIndent`
        // config argument no refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: false })
        );`,
      options: [{ allowConfig: false }],
      errors: [
        {
          messageId: "forbidden",
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
        },
      ],
    },
  ],
});
