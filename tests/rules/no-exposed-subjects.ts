/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-exposed-subjects");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-exposed-subjects", rule, {
  valid: [
    stripIndent`
      // variable
      import { Subject } from 'rxjs';

      const variable = new Subject<void>();
    `,
    stripIndent`
      // parameter and return type
      import { Subject } from 'rxjs';

      function foo(a$: Subject<any>): Subject<any> {
        return a$;
      }
    `,
    stripIndent`
      // private
      import { Observable, Subject } from 'rxjs';

      class Mock {
        private a = new Subject<void>();
        private readonly b = new Subject<void>();
        private c: number;

        constructor(
          private d: Subject<any>,
          private e: Observable<any>,
          f: Subject<any>,
        ) {}

        get g(): number {
          return this.age;
        }

        set g(newNum: number) {
          this._age = newNum;
        }

        private h(): Subject<any> {
          return new Subject<any>();
        }
      }
    `,
    {
      code: stripIndent`
        // allowed protected
        import { Subject } from 'rxjs';

        class Mock {
          protected a = new Subject<void>();

          constructor(
            protected b: Subject<any>,
          ){}

          protected get c(): Subject<any> {
            return this._submitSubject$;
          }

          protected set c(a: Subject<any>) {
            this._submitSubject$ = set$;
          }

          protected d(): Subject<any> {
            return new Subject<any>();
          }
        }
      `,
      options: [{ allowProtected: true }]
    }
  ],
  invalid: [
    {
      code: stripIndent`
        // public and protected
        import { Subject } from 'rxjs';

        class Mock {
          public a = new Subject<void>();
          protected b = new Subject<void>();
          c = new Subject<any>();
          public readonly d = new Subject<void>();
          readonly e = new Subject<void>();
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 10,
          endLine: 5,
          endColumn: 11,
          data: {
            subject: "a"
          }
        },
        {
          messageId: "forbidden",
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 14,
          data: {
            subject: "b"
          }
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 3,
          endLine: 7,
          endColumn: 4,
          data: {
            subject: "c"
          }
        },
        {
          messageId: "forbidden",
          line: 8,
          column: 19,
          endLine: 8,
          endColumn: 20,
          data: {
            subject: "d"
          }
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 12,
          endLine: 9,
          endColumn: 13,
          data: {
            subject: "e"
          }
        }
      ]
    },
    {
      code: stripIndent`
        // public and protected via constructor
        import { Subject } from 'rxjs';

        class Mock {
          constructor(
            public a: Subject<any>,
            protected b: Subject<any>,
          ) {}
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 6,
          column: 12,
          endLine: 6,
          endColumn: 13,
          data: {
            subject: "a"
          }
        },
        {
          messageId: "forbidden",
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 16,
          data: {
            subject: "b"
          }
        }
      ]
    },
    {
      code: stripIndent`
        // public via getter/setter
        import { Subject } from 'rxjs';

        class Mock {
          get a(): Subject<any> {
            return this._submitSubject$;
          }

          set a(a: Subject<any>) {
            this._submitSubject$ = set$;
          }
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 8,
          data: {
            subject: "a"
          }
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 7,
          endLine: 9,
          endColumn: 8,
          data: {
            subject: "a"
          }
        }
      ]
    },
    {
      code: stripIndent`
        // public return type
        import { Subject } from 'rxjs';

        class Mock {
          public a(): Subject<any> {
            return new Subject<any>();
          }

          b(): Subject<any> {
            return new Subject<any>();
          }
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 5,
          column: 10,
          endLine: 5,
          endColumn: 11,
          data: {
            subject: "a"
          }
        },
        {
          messageId: "forbidden",
          line: 9,
          column: 3,
          endLine: 9,
          endColumn: 4,
          data: {
            subject: "b"
          }
        }
      ]
    },
    {
      code: stripIndent`
        // public but allow protected
        import { Subject } from 'rxjs';

        class Mock {
          public a = new Subject<void>();

          constructor(
            public b: Subject<any>,
          ){}

          get c(): Subject<any> {
            return this._submitSubject$;
          }

          set c(a: Subject<any>) {
            this._submitSubject$ = set$;
          }

          d(): Subject<any> {
            return new Subject<any>();
          }
        }
      `,
      options: [{ allowProtected: true }],
      errors: [
        {
          messageId: "forbiddenAllowProtected",
          line: 5,
          column: 10,
          endLine: 5,
          endColumn: 11,
          data: {
            subject: "a"
          }
        },
        {
          messageId: "forbiddenAllowProtected",
          line: 8,
          column: 12,
          endLine: 8,
          endColumn: 13,
          data: {
            subject: "b"
          }
        },
        {
          messageId: "forbiddenAllowProtected",
          line: 11,
          column: 7,
          endLine: 11,
          endColumn: 8,
          data: {
            subject: "c"
          }
        },
        {
          messageId: "forbiddenAllowProtected",
          line: 15,
          column: 7,
          endLine: 15,
          endColumn: 8,
          data: {
            subject: "c"
          }
        },
        {
          messageId: "forbiddenAllowProtected",
          line: 19,
          column: 3,
          endLine: 19,
          endColumn: 4,
          data: {
            subject: "d"
          }
        }
      ]
    },
    {
      code: stripIndent`
        // EventEmitter
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}

        class Something {
          public a: EventEmitter<any>;
          protected b: EventEmitter<any>;
          public c: Subject<any>;
          protected d: Subject<any>;
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 9,
          column: 10,
          endLine: 9,
          endColumn: 11,
          data: {
            subject: "c"
          }
        },
        {
          messageId: "forbidden",
          line: 10,
          column: 13,
          endLine: 10,
          endColumn: 14,
          data: {
            subject: "d"
          }
        }
      ]
    }
  ]
});
