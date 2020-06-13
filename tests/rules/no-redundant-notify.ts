/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-redundant-notify");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-redundant-notify", rule, {
  valid: [
    stripIndent`
      // observable next + complete
      import { Observable } from "rxjs";
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.complete();
      })
    `,
    stripIndent`
      // observable next + error
      import { Observable } from "rxjs";
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.error(new Error("Kaboom!"));
      })
    `,
    stripIndent`
      // subject next + complete
      import { Subject } from "rxjs";
      const subject = new Subject<number>();
      subject.next(42);
      subject.complete();
    `,
    stripIndent`
      // subject next + error
      import { Subject } from "rxjs";
      const subject = new Subject<number>();
      subject.next(42);
      subject.error(new Error("Kaboom!"));
    `,
    stripIndent`
      // different names with error
      import { Subject } from "rxjs";
      const a = new Subject<number>();
      const b = new Subject<number>();
      a.error(new Error("Kaboom!"));
      b.error(new Error("Kaboom!"));
    `,
    stripIndent`
      // different names with complete
      import { Subject } from "rxjs";
      const a = new Subject<number>();
      const b = new Subject<number>();
      a.complete();
      b.complete();
    `,
    stripIndent`
      // non-observer
      import { Subject } from "rxjs";
      const subject = new Subject<number>();
      subject.error(new Error("Kaboom!"));
      console.error(new Error("Kaboom!"));
    `,
    stripIndent`
      // multiple subjects
      import { Subject } from "rxjs";
      class SomeClass {
        private a = new Subject<number>();
        private b = new Subject<number>();
        someMethod() {
          this.a.complete();
          this.b.next();
          this.b.complete();
        }
      }
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // observable complete + next
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.next(42);
                   ~~~~ [forbidden]
        })
      `
    ),
    fromFixture(
      stripIndent`
        // observable complete + complete
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.complete();
                   ~~~~~~~~ [forbidden]
        })
      `
    ),
    fromFixture(
      stripIndent`
        // observable complete + error
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.error(new Error("Kaboom!"));
                   ~~~~~ [forbidden]
        })
      `
    ),
    fromFixture(
      stripIndent`
        // observable error + next
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.next(42);
                   ~~~~ [forbidden]
        })
      `
    ),
    fromFixture(
      stripIndent`
        // observable error + complete
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.complete();
                   ~~~~~~~~ [forbidden]
        })
      `
    ),
    fromFixture(
      stripIndent`
        // observable error + error
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.error(new Error("Kaboom!"));
                   ~~~~~ [forbidden]
        });
      `
    ),
    fromFixture(
      stripIndent`
        // subject complete + next
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.next(42);
                ~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // subject complete + complete
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.complete();
                ~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // subject complete + error
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.error(new Error("Kaboom!"));
                ~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // subject error + next
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.next(42);
                ~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // subject error + complete
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.complete();
                ~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // subject error + error
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.error(new Error("Kaboom!"));
                ~~~~~ [forbidden]
      `
    ),
  ],
});
