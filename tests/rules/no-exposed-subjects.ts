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
                 ~ [forbidden]
          protected b = new Subject<void>();
                    ~ [forbidden]
          c = new Subject<any>();
          ~ [forbidden]
          public readonly d = new Subject<void>();
                          ~ [forbidden]
          readonly e = new Subject<void>();
                   ~ [forbidden]
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
                   ~ [forbidden]
            protected b: Subject<any>,
                      ~ [forbidden]
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
              ~ [forbidden]
            return this._submitSubject$;
          }

          set a(a: Subject<any>) {
              ~ [forbidden]
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
                 ~ [forbidden]
            return new Subject<any>();
          }

          b(): Subject<any> {
          ~ [forbidden]
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
                 ~ [forbiddenAllowProtected]

          constructor(
            public b: Subject<any>,
                   ~ [forbiddenAllowProtected]
          ) {}

          get c(): Subject<any> {
              ~ [forbiddenAllowProtected]
            return this._submitSubject$;
          }

          set c(a: Subject<any>) {
              ~ [forbiddenAllowProtected]
            this._submitSubject$ = set$;
          }

          d(): Subject<any> {
          ~ [forbiddenAllowProtected]
            return new Subject<any>();
          }
        }
      `,
      {},
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
                 ~ [forbidden]
          protected d: Subject<any>;
                    ~ [forbidden]
        }
      `
    ),
  ],
});
