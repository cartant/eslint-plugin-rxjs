/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import rule = require("../../source/rules/no-compat");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-compat", rule, {
  valid: [
    `import { Observable } from "rxjs";`,
    `import { ajax } from "rxjs/ajax";`,
    `import { concatMap } from "rxjs/operators";`,
    `import { TestScheduler } from "rxjs/testing";`,
    `import { webSocket } from "rxjs/webSocket";`,
    `import * as prefixedPackage from "rxjs-prefixed-package";`
  ],
  invalid: [
    {
      code: `import * as Rx from "rxjs/Rx";`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: `import { Observable } from 'rxjs/Observable';`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 45
        }
      ]
    },
    {
      code: `import { Subject } from "rxjs/Subject";`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      code: `import { merge } from "rxjs/observable/merge";`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 46
        }
      ]
    },
    {
      code: `import { mergeMap } from 'rxjs/operator/mergeMap';`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 50
        }
      ]
    },
    {
      code: `import { asap } from "rxjs/scheduler/asap";`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 43
        }
      ]
    },
    {
      code: `import "rxjs/add/observable/merge";`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 8,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      code: `import 'rxjs/add/operator/mergeMap';`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 8,
          endLine: 1,
          endColumn: 36
        }
      ]
    }
  ]
});
