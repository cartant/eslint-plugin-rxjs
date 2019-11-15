/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
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
      const a = new Subject<number>();
      const b = new Subject<number>();
      a.error(new Error("Kaboom!"));
      b.error(new Error("Kaboom!"));
    `,
    stripIndent`
      // different names with complete
      const a = new Subject<number>();
      const b = new Subject<number>();
      a.complete();
      b.complete();
    `,
    stripIndent`
      // non-observer
      const subject = new Subject<number>();
      subject.error(new Error("Kaboom!"));
      console.error(new Error("Kaboom!"));
    `
  ],
  invalid: [
    {
      code: stripIndent`
        // observable complete + next
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.next(42);
        })
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        // observable complete + complete
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.complete();
        })
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 20
        }
      ]
    },
    {
      code: stripIndent`
        // observable complete + error
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.error(new Error("Kaboom!"));
        })
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 17
        }
      ]
    },
    {
      code: stripIndent`
        // observable error + next
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.next(42);
        })
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        // observable error + complete
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.complete();
        })
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 20
        }
      ]
    },
    {
      code: stripIndent`
        // observable error + error
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.error(new Error("Kaboom!"));
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 17
        }
      ]
    },
    {
      code: stripIndent`
        // subject complete + next
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.next(42);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        // subject complete + complete
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.complete();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 17
        }
      ]
    },
    {
      code: stripIndent`
        // subject complete + error
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.error(new Error("Kaboom!"));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    {
      code: stripIndent`
        // subject error + next
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.next(42);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        // subject error + complete
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.complete();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 17
        }
      ]
    },
    {
      code: stripIndent`
        // subject error + error
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.error(new Error("Kaboom!"));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 14
        }
      ]
    }
  ]
});
