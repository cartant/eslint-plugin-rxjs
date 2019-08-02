/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { RuleTester } from "eslint";
import rule = require("../../source/rules/no-sharereplay");
import { configWithoutTypes } from "../utils";

const ruleTester = new RuleTester({
  ...configWithoutTypes
});
ruleTester.run("no-sharereplay", rule, {
  valid: [
    {
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay({ refCount: true })
        );`,
      options: [{ allowConfig: true }]
    },
    {
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay({ refCount: false })
        );`,
      options: [{ allowConfig: true }]
    }
  ],
  invalid: [
    {
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay()
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 3,
          endLine: 2,
          endColumn: 14
        }
      ]
    },
    {
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay()
        );`,
      options: [{ allowConfig: true }],
      errors: [
        {
          messageId: "forbiddenWithoutConfig",
          line: 2,
          column: 3,
          endLine: 2,
          endColumn: 14
        }
      ]
    },
    {
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay(1)
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 3,
          endLine: 2,
          endColumn: 14
        }
      ]
    },
    {
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay(1, 100)
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 3,
          endLine: 2,
          endColumn: 14
        }
      ]
    },
    {
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay(1, 100, asapScheduler)
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 3,
          endLine: 2,
          endColumn: 14
        }
      ]
    },
    {
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay({ refCount: true })
        );`,
      options: [{ allowConfig: false }],
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 3,
          endLine: 2,
          endColumn: 14
        }
      ]
    },
    {
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay({ refCount: false })
        );`,
      options: [{ allowConfig: false }],
      errors: [
        {
          messageId: "forbidden",
          line: 2,
          column: 3,
          endLine: 2,
          endColumn: 14
        }
      ]
    }
  ]
});
