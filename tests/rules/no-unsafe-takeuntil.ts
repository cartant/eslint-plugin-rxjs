/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-unsafe-takeuntil");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-unsafe-takeuntil", rule, {
  valid: [
    {
      code: stripIndent`
        import { of } from "rxjs";
        import { switchMap, takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("d");

        const d = a.pipe(switchMap(_ => b), takeUntil(c)).subscribe();
      `
    },
    {
      code: stripIndent`
        import { combineLatest, of } from "rxjs";
        import { takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");
        const d = of("d");

        const e = a.pipe(s => combineLatest(s, b, c), takeUntil(d)).subscribe();
      `
    },
    {
      code: stripIndent`
        import { of } from "rxjs";
        import { switchMap, takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("d");

        const d = a.pipe(switchMap(_ => b), pipe(takeUntil(d), switchMap(_ => b))).subscribe();
      `
    },
    {
      code: stripIndent`
        import { of } from "rxjs";
        import {
            count,
            defaultIfEmpty,
            endWith,
            every,
            finalize,
            isEmpty,
            last,
            max,
            min,
            publish,
            publishBehavior,
            publishLast,
            publishReplay,
            reduce,
            share,
            shareReplay,
            skipLast,
            takeLast,
            takeUntil,
            throwIfEmpty,
            toArray
        } from "rxjs/operators";

        const a = of("a");
        const b = of("b");

        let r: Observable<any>;

        r = a.pipe(takeUntil(b), count()).subscribe();
        r = a.pipe(takeUntil(b), defaultIfEmpty('empty')).subscribe();
        r = a.pipe(takeUntil(b), endWith("z")).subscribe();
        r = a.pipe(takeUntil(b), every(value => value !== "z")).subscribe();
        r = a.pipe(takeUntil(b), finalize(() => {})).subscribe();
        r = a.pipe(takeUntil(b), isEmpty()).subscribe();
        r = a.pipe(takeUntil(b), last()).subscribe();
        r = a.pipe(takeUntil(b), max()).subscribe();
        r = a.pipe(takeUntil(b), min()).subscribe();
        r = a.pipe(takeUntil(b), publish()).subscribe();
        r = a.pipe(takeUntil(b), publishBehavior("x")).subscribe();
        r = a.pipe(takeUntil(b), publishLast()).subscribe();
        r = a.pipe(takeUntil(b), publishReplay(1)).subscribe();
        r = a.pipe(takeUntil(b), reduce((acc, value) => acc + value, "")).subscribe();
        r = a.pipe(takeUntil(b), share()).subscribe();
        r = a.pipe(takeUntil(b), shareReplay(1)).subscribe();
        r = a.pipe(takeUntil(b), skipLast(1)).subscribe();
        r = a.pipe(takeUntil(b), takeLast(1)).subscribe();
        r = a.pipe(takeUntil(b), throwIfEmpty()).subscribe();
        r = a.pipe(takeUntil(b), toArray()).subscribe();
      `
    },
    {
      code: stripIndent`
        import { combineLatest, of } from "rxjs";
        import { takeUntil, tap } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");
        const d = of("d");

        const e = a.pipe(takeUntil(d), tap(value => console.log(value))).subscribe();
      `,
      options: [
        {
          allow: ["tap"]
        }
      ]
    }
  ],
  invalid: [
    {
      code: stripIndent`
        import { of } from "rxjs";
        import { switchMap, takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("d");

        const d = a.pipe(takeUntil(c), switchMap(_ => b)).subscribe();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 18,
          endLine: 8,
          endColumn: 27
        }
      ]
    },
    {
      code: stripIndent`
        import { combineLatest, of } from "rxjs";
        import { takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");
        const d = of("d");

        const e = a.pipe(takeUntil(d), s => combineLatest(s, b, c)).subscribe();
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 9,
          column: 18,
          endLine: 9,
          endColumn: 27
        }
      ]
    },
    {
      code: stripIndent`
        import { combineLatest, of } from "rxjs";
        import { takeUntil, tap, switchMap } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");

        const d = a.pipe(takeUntil(c), tap(value => console.log(value)), switchMap(_ => b)).subscribe();
      `,
      options: [
        {
          allow: ["tap"]
        }
      ],
      errors: [
        {
          messageId: "forbidden",
          line: 8,
          column: 18,
          endLine: 8,
          endColumn: 27
        }
      ]
    },
    {
      code: stripIndent`
        import { fromEventPattern, NEVER } from "rxjs";
        import { map, startWith, takeUntil } from "rxjs/operators";

        type MediaQueryList = any;
        type Query = any;

        class MyClass {
          private _destroy = NEVER;
          private _registerQuery(query: string): Query {
            const mql: MediaQueryList = null;
            const queryObservable = fromEventPattern<MediaQueryList>(
              (listener: Function) => {},
              (listener: Function) => {}
            ).pipe(
              takeUntil(this._destroy),
              startWith(mql),
              map((nextMql: MediaQueryList) => ({}))
            );
            const output = { observable: queryObservable, mql: mql };
            return output;
          }
        }
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 15,
          column: 7,
          endLine: 15,
          endColumn: 16
        }
      ]
    }
  ]
});
