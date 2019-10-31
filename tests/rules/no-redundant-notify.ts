/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-redundant-notify");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-redundant-notify", rule, {
  valid: [
    stripIndent`
      // Observable next + complete
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.complete();
      })
    `,
    stripIndent`
      // Observable next + error
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.error(new Error("Kaboom!"));
      })
    `,
    stripIndent`
      // Subject next + complete
      const subject = new Subject<number>();
      subject.next(42);
      subject.complete();
    `,
    stripIndent`
      // Subject next + error
      const subject = new Subject<number>();
      subject.next(42);
      subject.error(new Error("Kaboom!"));
    `
  ],
  invalid: []
});
