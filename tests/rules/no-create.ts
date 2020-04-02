/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-create");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-create", rule, {
  invalid: [
    {
      code: stripIndent`
        // create
        import { Observable, Observer } from "rxjs";

        const ob = Observable.create((observer: Observer<string>) => {
            observer.next("Hello, world.");
            observer.complete();
            return () => {};
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 29,
        },
      ],
    },
  ],
});
