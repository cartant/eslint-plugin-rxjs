/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
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
  const that = { actions };`;

ruleTester({ types: true }).run("no-unsafe-first", rule, {
  valid: [
    {
      code: stripIndent`
        ${setup}

        const safePipedOfTypeFirstEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `
    },
    {
      code: stripIndent`
        ${setup}

        const safePipedOfTypeTakeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `
    },
    {
      code: stripIndent`
        ${setup}

        const safePipedOfTypeFirstEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `
    },
    {
      code: stripIndent`
        ${setup}

        const safePipedOfTypeTakeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `
    },
    {
      code: stripIndent`
        ${setup}

        const safePipedOfTypeFirstEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `
    },
    {
      code: stripIndent`
        ${setup}

        const safePipedOfTypeTakeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `
    },
    {
      code: stripIndent`
        ${setup}

        const safePipedOfTypeFirstEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          first()
        );
      `,
      options: [{ observable: "foo" }]
    }
  ],
  invalid: [
    {
      code: stripIndent`
        ${setup}

        const unsafePipedOfTypeFirstEffect = actions$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 17,
          column: 11,
          endLine: 17,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        ${setup}

        const unsafePipedOfTypeTakeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 17,
          column: 11,
          endLine: 17,
          endColumn: 15
        }
      ]
    },
    {
      code: stripIndent`
        ${setup}

        const unsafePipedOfTypeFirstEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 17,
          column: 11,
          endLine: 17,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        ${setup}

        const unsafePipedOfTypeTakeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 17,
          column: 11,
          endLine: 17,
          endColumn: 15
        }
      ]
    },
    {
      code: stripIndent`
        ${setup}

        const unsafePipedOfTypeFirstEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 17,
          column: 11,
          endLine: 17,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        ${setup}

        const unsafePipedOfTypeTakeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 17,
          column: 11,
          endLine: 17,
          endColumn: 15
        }
      ]
    },
    {
      code: stripIndent`
        ${setup}

        const unsafePipedOfTypeTakeEpic = (foo: Actions) => foo.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
        );
      `,
      options: [
        {
          observable: "foo"
        }
      ],
      errors: [
        {
          messageId: "forbidden",
          line: 17,
          column: 11,
          endLine: 17,
          endColumn: 15
        }
      ]
    }
  ]
});
