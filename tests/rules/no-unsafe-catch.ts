/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-unsafe-catch");
import { ruleTester } from "../utils";

const setup = stripIndent`
  import { EMPTY, Observable, of } from "rxjs";
  import { first, switchMap, take, tap } from "rxjs/operators";

  function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
    return source => source;
  }

  type Actions = Observable<any>;
  const actions = of({});
  const that = { actions };
`;

ruleTester({ types: true }).run("no-unsafe-catch", rule, {
  valid: [
    {
      code: stripIndent`
        // actions with caught
        ${setup}
        const safePipedOfTypeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError((error, caught) => caught)
        );
      `,
    },
    {
      code: stripIndent`
        // actions property with caught
        ${setup}
        const safePipedOfTypeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError((error, caught) => caught)
        );
      `,
    },
    {
      code: stripIndent`
        // epic with caught
        ${setup}
        const safePipedOfTypeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError((error, caught) => caught)
        );
      `,
    },
    {
      code: stripIndent`
        // actions nested
        ${setup}
        const safePipedOfTypeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(catchError(() => EMPTY)))
        );
      `,
    },
    {
      code: stripIndent`
        // actions property nested
        ${setup}
        const safePipedOfTypeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(catchError(() => EMPTY)))
        );
      `,
    },
    {
      code: stripIndent`
        // epic nested
        ${setup}
        const safePipedOfTypeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(catchError(() => EMPTY)))
        );
      `,
    },
    {
      code: stripIndent`
        // non-matching options
        ${setup}
        const effect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          catchError(() => EMPTY)
        );
      `,
      options: [{ observable: "foo" }],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        // unsafe actions
        ${setup}
        const unsafePipedOfTypeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 16,
          column: 11,
          endLine: 16,
          endColumn: 21,
        },
      ],
    },
    {
      code: stripIndent`
        // unsafe actions property
        ${setup}
        const unsafePipedOfTypeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 16,
          column: 11,
          endLine: 16,
          endColumn: 21,
        },
      ],
    },
    {
      code: stripIndent`
        // unsafe epic
        ${setup}
        const unsafePipedOfTypeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 16,
          column: 11,
          endLine: 16,
          endColumn: 21,
        },
      ],
    },
    {
      code: stripIndent`
        // matching options
        ${setup}
        const unsafePipedOfTypeTakeEpic = (foo: Actions) => foo.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
        );
      `,
      options: [
        {
          observable: "foo",
        },
      ],
      errors: [
        {
          messageId: "forbidden",
          line: 16,
          column: 11,
          endLine: 16,
          endColumn: 21,
        },
      ],
    },
  ],
});
