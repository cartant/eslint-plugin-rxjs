/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-unsafe-switchmap");
import { ruleTester } from "../utils";

const setup = stripIndent`
  import { EMPTY, Observable, of } from "rxjs";
  import { switchMap, tap } from "rxjs/operators";

  function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
    return source => source;
  }

  type Actions = Observable<any>;
  const actions = of({});

  const GET_SOMETHING = "GET_SOMETHING";
  const PUT_SOMETHING = "PUT_SOMETHING";
  const GetSomething = GET_SOMETHING;
  const PutSomething = PUT_SOMETHING;
`;
const setupLines = 14;

ruleTester({ types: true }).run("no-unsafe-switchmap", rule, {
  valid: [
    {
      code: stripIndent`
        // effect GET string
        ${setup}
        const pipedGetEffect = actions.pipe(ofType("GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
        const pipedMoreGetEffect = actions.pipe(ofType("DO_SOMETHING", "GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
      `
    },
    {
      code: stripIndent`
        // epic GET string
        ${setup}
        const pipedGetEpic = (action$: Actions) => action$.pipe(ofType("GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
        const pipedMoreGetEpic = (action$: Actions) => action$.pipe(ofType("DO_SOMETHING", "GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
      `
    },
    {
      code: stripIndent`
        // effect GET symbol
        ${setup}
        const pipedSymbolGetEffect = actions.pipe(ofType(GET_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
        const pipedOfTypeCamelCaseGetEffect = actions.pipe(ofType(GetSomething), tap(() => {}), switchMap(() => EMPTY));
      `
    },
    {
      code: stripIndent`
        // matching allow in options
        ${setup}
        const fooEffect = actions.pipe(ofType("FOO"), tap(() => {}), switchMap(() => EMPTY));
      `,
      options: [
        {
          allow: ["FOO"]
        }
      ]
    },
    {
      code: stripIndent`
        // non-matching disallow in options
        ${setup}
        const barEffect = actions.pipe(ofType("BAR"), tap(() => {}), switchMap(() => EMPTY));
        const bazEffect = actions.pipe(ofType("BAZ"), tap(() => {}), switchMap(() => EMPTY));
      `,
      options: [
        {
          disallow: ["FOO"]
        }
      ]
    }
  ],
  invalid: [
    {
      code: stripIndent`
        // effect PUT string
        ${setup}
        const pipedPutEffect = actions.pipe(ofType("PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
        const pipedMorePutEffect = actions.pipe(ofType("DO_SOMETHING", "PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: setupLines + 2,
          column: 85,
          endLine: setupLines + 2,
          endColumn: 94
        },
        {
          messageId: "forbidden",
          line: setupLines + 3,
          column: 105,
          endLine: setupLines + 3,
          endColumn: 114
        }
      ]
    },
    {
      code: stripIndent`
        // epic PUT string
        ${setup}
        const pipedPutEpic = (action$: Actions) => action$.pipe(ofType("PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
        const pipedMorePutEpic = (action$: Actions) => action$.pipe(ofType("DO_SOMETHING", "PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: setupLines + 2,
          column: 105,
          endLine: setupLines + 2,
          endColumn: 114
        },
        {
          messageId: "forbidden",
          line: setupLines + 3,
          column: 125,
          endLine: setupLines + 3,
          endColumn: 134
        }
      ]
    },
    {
      code: stripIndent`
        // effect PUT symbol
        ${setup}
        const pipedSymbolPutEffect = actions.pipe(ofType(PUT_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
        const pipedOfTypeCamelCasePutEffect = actions.pipe(ofType(PutSomething), tap(() => {}), switchMap(() => EMPTY));
      `,
      errors: [
        {
          messageId: "forbidden",
          line: setupLines + 2,
          column: 89,
          endLine: setupLines + 2,
          endColumn: 98
        },
        {
          messageId: "forbidden",
          line: setupLines + 3,
          column: 97,
          endLine: setupLines + 3,
          endColumn: 106
        }
      ]
    },
    {
      code: stripIndent`
        // non-matching allow in options
        ${setup}
        const barEffect = actions.pipe(ofType("BAR"), tap(() => {}), switchMap(() => EMPTY));
        const bazEffect = actions.pipe(ofType("BAZ"), tap(() => {}), switchMap(() => EMPTY));
      `,
      options: [
        {
          allow: ["FOO"]
        }
      ],
      errors: [
        {
          messageId: "forbidden",
          line: setupLines + 2,
          column: 70,
          endLine: setupLines + 2,
          endColumn: 79
        },
        {
          messageId: "forbidden",
          line: setupLines + 3,
          column: 70,
          endLine: setupLines + 3,
          endColumn: 79
        }
      ]
    },
    {
      code: stripIndent`
        // matching disallow in options
        ${setup}
        const fooEffect = actions.pipe(ofType("FOO"), tap(() => {}), switchMap(() => EMPTY));
      `,
      options: [
        {
          disallow: ["FOO"]
        }
      ],
      errors: [
        {
          messageId: "forbidden",
          line: setupLines + 2,
          column: 70,
          endLine: setupLines + 2,
          endColumn: 79
        }
      ]
    }
  ]
});
