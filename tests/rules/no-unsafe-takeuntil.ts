/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-unsafe-takeuntil");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-unsafe-takeuntil", rule, {
  valid: [
    {
      code: stripIndent`
        // after switchMap
        import { of } from "rxjs";
        import { switchMap, takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");

        const d = a.pipe(switchMap(_ => b), takeUntil(c)).subscribe();
      `,
    },
    {
      code: stripIndent`
        // after combineLatest
        import { combineLatest, of } from "rxjs";
        import { takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");
        const d = of("d");

        const e = a.pipe(s => combineLatest(s, b, c), takeUntil(d)).subscribe();
      `,
    },
    {
      code: stripIndent`
        // after switchMap but hidden in pipe
        import { of } from "rxjs";
        import { switchMap, takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");

        const d = a.pipe(switchMap(_ => b), pipe(takeUntil(d), switchMap(_ => b))).subscribe();
      `,
    },
    {
      code: stripIndent`
        // before allowed
        import { of, Subscription } from "rxjs";
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

        let r: Subscription;

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
      `,
    },
    {
      code: stripIndent`
        // before allowed in options
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
          allow: ["tap"],
        },
      ],
    },
    {
      code: stripIndent`
        // after switchMap as alias
        import { of } from "rxjs";
        import { switchMap, takeUntil } from "rxjs/operators";

        declare const untilDestroyed: Function;

        const a = of("a");
        const b = of("b");
        const c = of("c");

        const d = a.pipe(switchMap(_ => b), untilDestroyed()).subscribe();
      `,
      options: [
        {
          alias: ["untilDestroyed"],
        },
      ],
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/66
        import { of, Subscription } from "rxjs";
        import { takeUntil } from "rxjs/operators";

        declare const untilDestroyed: Function;

        const a = of("a");
        const b = of("b");
        const c = of("c");

        let r: Subscription;

        r = a.pipe(takeUntil(b), takeUntil(c)).subscribe();
        r = a.pipe(takeUntil(b), untilDestroyed()).subscribe();
        r = a.pipe(untilDestroyed(), takeUntil(c)).subscribe();
      `,
      options: [
        {
          alias: ["untilDestroyed"],
        },
      ],
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/79
        import { of } from "rxjs";
        import { repeatWhen, takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");

        const r = a.pipe(
          takeUntil(b),
          repeatWhen(() => of(true)),
          takeUntil(c)
        ).subscribe();
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // before switchMap
        import { of } from "rxjs";
        import { switchMap, takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");

        const d = a.pipe(takeUntil(c), switchMap(_ => b)).subscribe();
                         ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // before combineLatest
        import { combineLatest, of } from "rxjs";
        import { takeUntil } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");
        const d = of("d");

        const e = a.pipe(takeUntil(d), s => combineLatest(s, b, c)).subscribe();
                         ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // after allowed before switchMap
        import { combineLatest, of } from "rxjs";
        import { takeUntil, tap, switchMap } from "rxjs/operators";

        const a = of("a");
        const b = of("b");
        const c = of("c");

        const d = a.pipe(takeUntil(c), tap(value => console.log(value)), switchMap(_ => b)).subscribe();
                         ~~~~~~~~~ [forbidden]
      `,
      {
        options: [
          {
            allow: ["tap"],
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // https://github.com/rxjs-tslint-rules/issues/49
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
              ~~~~~~~~~ [forbidden]
              startWith(mql),
              map((nextMql: MediaQueryList) => ({}))
            );
            const output = { observable: queryObservable, mql: mql };
            return output;
          }
        }
      `
    ),
    fromFixture(
      stripIndent`
        // before switchMap as an alias
        import { of } from "rxjs";
        import { switchMap, takeUntil } from "rxjs/operators";

        declare const untilDestroyed: Function;

        const a = of("a");
        const b = of("b");
        const c = of("c");

        const d = a.pipe(untilDestroyed(), switchMap(_ => b)).subscribe();
                         ~~~~~~~~~~~~~~ [forbidden]
      `,
      {
        options: [
          {
            alias: ["untilDestroyed"],
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // before switchMap as an alias and a class member
        import { of } from "rxjs";
        import { switchMap, takeUntil } from "rxjs/operators";

        declare const obj: { untilDestroyed: Function };

        const a = of("a");
        const b = of("b");
        const c = of("c");

        const d = a.pipe(obj.untilDestroyed(), switchMap(_ => b)).subscribe();
                         ~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
      {
        options: [
          {
            alias: ["untilDestroyed"],
          },
        ],
      }
    ),
  ],
});
