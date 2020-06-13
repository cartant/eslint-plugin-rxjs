/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-ignored-error");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-ignored-error", rule, {
  valid: [
    stripIndent`
      // noop
      import { of } from "rxjs";
      const observable = of([1, 2]);
      observable.subscribe(() => {}, () => {});
    `,
    stripIndent`
      // subject
      import { Subject } from "rxjs";
      const subject = new Subject<any>();
      const observable = of([1, 2]);
      observable.subscribe(subject);
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // arrow next ignored error
        import { of } from "rxjs";
        const observable = of([1, 2]);
        observable.subscribe(() => {});
                   ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // variable next ignored error
        import { of } from "rxjs";
        const observable = of([1, 2]);
        const next = () => {};
        observable.subscribe(next);
                   ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // subject arrow next ignored error
        import { Subject } from "rxjs";
        const subject = new Subject<any>();
        subject.subscribe(() => {});
                ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // subject variable next ignored error
        import { Subject } from "rxjs";
        const next = () => {};
        const subject = new Subject<any>();
        subject.subscribe(next);
                ~~~~~~~~~ [forbidden]
      `
    ),
  ],
});
