/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
      options: [{ allowProtected: true }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // public and protected
        import { Subject } from 'rxjs';

        class Mock {
          public a = new Subject<void>();
                 ~ [forbidden { "subject": "a" }]
          protected b = new Subject<void>();
                    ~ [forbidden { "subject": "b" }]
          c = new Subject<any>();
          ~ [forbidden { "subject": "c" }]
          public readonly d = new Subject<void>();
                          ~ [forbidden { "subject": "d" }]
          readonly e = new Subject<void>();
                   ~ [forbidden { "subject": "e" }]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // public and protected via constructor
        import { Subject } from 'rxjs';

        class Mock {
          constructor(
            public a: Subject<any>,
                   ~ [forbidden { "subject": "a" }]
            protected b: Subject<any>,
                      ~ [forbidden { "subject": "b" }]
          ) {}
        }
      `
    ),
    fromFixture(
      stripIndent`
        // public via getter/setter
        import { Subject } from 'rxjs';

        class Mock {
          get a(): Subject<any> {
              ~ [forbidden { "subject": "a" }]
            return this._submitSubject$;
          }

          set a(a: Subject<any>) {
              ~ [forbidden { "subject": "a" }]
            this._submitSubject$ = set$;
          }
        }
      `
    ),
    fromFixture(
      stripIndent`
        // public return type
        import { Subject } from 'rxjs';

        class Mock {
          public a(): Subject<any> {
                 ~ [forbidden { "subject": "a" }]
            return new Subject<any>();
          }

          b(): Subject<any> {
          ~ [forbidden { "subject": "b" }]
            return new Subject<any>();
          }
        }
      `
    ),
    fromFixture(
      stripIndent`
        // public but allow protected
        import { Subject } from 'rxjs';

        class Mock {
          public a = new Subject<void>();
                 ~ [forbiddenAllowProtected { "subject": "a" }]

          constructor(
            public b: Subject<any>,
                   ~ [forbiddenAllowProtected { "subject": "b" }]
          ) {}

          get c(): Subject<any> {
              ~ [forbiddenAllowProtected { "subject": "c" }]
            return this._submitSubject$;
          }

          set c(a: Subject<any>) {
              ~ [forbiddenAllowProtected { "subject": "c" }]
            this._submitSubject$ = set$;
          }

          d(): Subject<any> {
          ~ [forbiddenAllowProtected { "subject": "d" }]
            return new Subject<any>();
          }
        }
      `,
      { options: [{ allowProtected: true }] }
    ),
    fromFixture(
      stripIndent`
        // EventEmitter
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}

        class Something {
          public a: EventEmitter<any>;
          protected b: EventEmitter<any>;
          public c: Subject<any>;
                 ~ [forbidden { "subject": "c" }]
          protected d: Subject<any>;
                    ~ [forbidden { "subject": "d" }]
        }
      `
    ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/91
        import { Subject } from "rxjs";

        class AppComponent {
          public foo$: Subject<unknown>;
                 ~~~~ [forbidden { "subject": "foo$" }]
          public bar$ = new Subject<unknown>();
                 ~~~~ [forbidden { "subject": "bar$" }]
          public getFoo(): Subject<unknown> {
                 ~~~~~~ [forbidden { "subject": "getFoo" }]
            return this.foo$;
          }
        }
      `
    ),
  ],
});
