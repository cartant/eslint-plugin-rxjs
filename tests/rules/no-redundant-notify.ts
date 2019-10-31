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
      // observable next + complete
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.complete();
      })
    `,
    stripIndent`
      // observable next + error
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.error(new Error("Kaboom!"));
      })
    `,
    stripIndent`
      // subject next + complete
      const subject = new Subject<number>();
      subject.next(42);
      subject.complete();
    `,
    stripIndent`
      // subject next + error
      const subject = new Subject<number>();
      subject.next(42);
      subject.error(new Error("Kaboom!"));
    `
  ],
  invalid: [
    {
      code: stripIndent`
        // observable complete + next
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.next(42);
        })
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 12,
          endLine: 4,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        // observable complete + complete
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.complete();
        })
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 12,
          endLine: 4,
          endColumn: 20
        }
      ]
    },
    {
      code: stripIndent`
        // observable complete + error
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.error(new Error("Kaboom!"));
        })
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 12,
          endLine: 4,
          endColumn: 17
        }
      ]
    },
    {
      code: stripIndent`
        // observable error + next
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.next(42);
        })
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 12,
          endLine: 4,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        // observable error + complete
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.complete();
        })
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 12,
          endLine: 4,
          endColumn: 20
        }
      ]
    },
    {
      code: stripIndent`
        // observable error + error
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.error(new Error("Kaboom!"));
        });
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 12,
          endLine: 4,
          endColumn: 17
        }
      ]
    },
    {
      code: stripIndent`
        // subject complete + next
        const subject = new Subject<number>();
        subject.complete();
        subject.next(42);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        // subject complete + complete
        const subject = new Subject<number>();
        subject.complete();
        subject.complete();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 17
        }
      ]
    },
    {
      code: stripIndent`
        // subject complete + error
        const subject = new Subject<number>();
        subject.complete();
        subject.error(new Error("Kaboom!"));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 14
        }
      ]
    },
    {
      code: stripIndent`
        // subject error + next
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.next(42);
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 13
        }
      ]
    },
    {
      code: stripIndent`
        // subject error + complete
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.complete();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 17
        }
      ]
    },
    {
      code: stripIndent`
        // subject error + error
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.error(new Error("Kaboom!"));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 14
        }
      ]
    }
  ]
});
