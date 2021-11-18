/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-unsafe-first");
import { ruleTester } from "../utils";

const setup = stripIndent`
  import { EMPTY, Observable, of } from "rxjs";
  import { first, switchMap, take, tap } from "rxjs/operators";

  function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
    return source => source;
  }

  type Actions = Observable<any>;
  const actions = of({});
  const actions$ = of({});
  const that = { actions };
`.replace(/\n/g, "");

ruleTester({ types: true }).run("no-unsafe-first", rule, {
  valid: [
    {
      code: stripIndent`
        // actions nested first
        ${setup}
        const safePipedOfTypeFirstEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `,
    },
    {
      code: stripIndent`
        // actions nested take
        ${setup}
        const safePipedOfTypeTakeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `,
    },
    {
      code: stripIndent`
        // actions property nested first
        ${setup}
        const safePipedOfTypeFirstEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `,
    },
    {
      code: stripIndent`
        // actions property nested take
        ${setup}
        const safePipedOfTypeTakeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `,
    },
    {
      code: stripIndent`
        // epic nested first
        ${setup}
        const safePipedOfTypeFirstEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `,
    },
    {
      code: stripIndent`
        // epic nested take
        ${setup}
        const safePipedOfTypeTakeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `,
    },
    {
      code: stripIndent`
        // non-matching options
        ${setup}
        const safePipedOfTypeFirstEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          first()
        );
      `,
      options: [{ observable: "foo" }],
    },
    {
      code: stripIndent`
        // mid-identifier action
        ${setup}
        const safe = transactionSource.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          first()
        );
      `,
      options: [{ observable: "foo" }],
    },
    {
      code: stripIndent`
        // mid-identifier action
        import { of } from "rxjs";
        import { first, tap } from "rxjs/operators";
        const transactionSource = of();
        const safe = transactionSource.pipe(
          tap(() => {}),
          first()
        );
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/89
        ${setup}
        const safeEffect$ = actions$.pipe(
          ofType("SAVING"),
          mergeMap(({ entity }) =>
            actions$.pipe(
              ofType("ADDED", "MODIFIED"),
              tap(() => {}),
              first(),
              tap(() => {}),
            ),
          ),
        );
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // actions first
        ${setup}
        const unsafePipedOfTypeFirstEffect = actions$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
          ~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // actions take
        ${setup}
        const unsafePipedOfTypeTakeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // actions property first
        ${setup}
        const unsafePipedOfTypeFirstEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
          ~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // actions property take
        ${setup}
        const unsafePipedOfTypeTakeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // epic first
        ${setup}
        const unsafePipedOfTypeFirstEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
          ~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        //epic take
        ${setup}
        const unsafePipedOfTypeTakeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // matching options
        ${setup}
        const unsafePipedOfTypeTakeEpic = (foo: Actions) => foo.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~ [forbidden]
        );
      `,
      {
        options: [
          {
            observable: "foo",
          },
        ],
      }
    ),
  ],
});
