/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { RuleTester } from "eslint";
import rule = require("../../source/rules/no-connectable");
import { configWithTypes } from "../utils";

const ruleTester = new RuleTester({
  ...configWithTypes
});
ruleTester.run("no-connectable", rule, {
  valid: [
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(new Subject(), p => p)
        );`
    },
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(() => new Subject(), p => p)
        );`
    },
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const selector = p => p;
        const result = of(42).pipe(
          multicast(() => new Subject(), selector)
        );`
    },
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          publish(p => p)
        );`
    },
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { publishReplay } from "rxjs/operators";
        const result = of(42).pipe(
          publishReplay(1, p => p)
        )`
    }
  ],
  invalid: [
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { publish } from "rxjs/operators";
        const result = of(42).pipe(
          publish()
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 10
        }
      ]
    },
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { publishBehavior } from "rxjs/operators";
        const result = of(42).pipe(
          publishBehavior(1)
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 18
        }
      ]
    },
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { publishLast } from "rxjs/operators";
        const result = of(42).pipe(
          publishLast()
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 14
        }
      ]
    },
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { publishReplay } from "rxjs/operators";
        const result = of(42).pipe(
          publishReplay(1)
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(new Subject<number>())
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 12
        }
      ]
    },
    {
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(() => new Subject<number>())
        );`,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 12
        }
      ]
    }
  ]
});
