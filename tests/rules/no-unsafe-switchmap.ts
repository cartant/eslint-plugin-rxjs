/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
`.replace(/\n/g, "");

ruleTester({ types: true }).run("no-unsafe-switchmap", rule, {
  valid: [
    {
      code: stripIndent`
        // effect GET string
        ${setup}
        const pipedGetEffect = actions.pipe(ofType("GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
        const pipedMoreGetEffect = actions.pipe(ofType("DO_SOMETHING", "GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
      `,
    },
    {
      code: stripIndent`
        // epic GET string
        ${setup}
        const pipedGetEpic = (action$: Actions) => action$.pipe(ofType("GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
        const pipedMoreGetEpic = (action$: Actions) => action$.pipe(ofType("DO_SOMETHING", "GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
      `,
    },
    {
      code: stripIndent`
        // effect GET symbol
        ${setup}
        const pipedSymbolGetEffect = actions.pipe(ofType(GET_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
        const pipedOfTypeCamelCaseGetEffect = actions.pipe(ofType(GetSomething), tap(() => {}), switchMap(() => EMPTY));
      `,
    },
    {
      code: stripIndent`
        // matching allow in options
        ${setup}
        const fooEffect = actions.pipe(ofType("FOO"), tap(() => {}), switchMap(() => EMPTY));
      `,
      options: [
        {
          allow: ["FOO"],
        },
      ],
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
          disallow: ["FOO"],
        },
      ],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // effect PUT string
        ${setup}
        const pipedPutEffect = actions.pipe(ofType("PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
                                                                                    ~~~~~~~~~ [forbidden]
        const pipedMorePutEffect = actions.pipe(ofType("DO_SOMETHING", "PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
                                                                                                        ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // epic PUT string
        ${setup}
        const pipedPutEpic = (action$: Actions) => action$.pipe(ofType("PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
                                                                                                        ~~~~~~~~~ [forbidden]
        const pipedMorePutEpic = (action$: Actions) => action$.pipe(ofType("DO_SOMETHING", "PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
                                                                                                                            ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // effect PUT symbol
        ${setup}
        const pipedSymbolPutEffect = actions.pipe(ofType(PUT_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
                                                                                        ~~~~~~~~~ [forbidden]
        const pipedOfTypeCamelCasePutEffect = actions.pipe(ofType(PutSomething), tap(() => {}), switchMap(() => EMPTY));
                                                                                                ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // non-matching allow in options
        ${setup}
        const barEffect = actions.pipe(ofType("BAR"), tap(() => {}), switchMap(() => EMPTY));
                                                                     ~~~~~~~~~ [forbidden]
        const bazEffect = actions.pipe(ofType("BAZ"), tap(() => {}), switchMap(() => EMPTY));
                                                                     ~~~~~~~~~ [forbidden]
      `,
      {
        options: [
          {
            allow: ["FOO"],
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // matching disallow in options
        ${setup}
        const fooEffect = actions.pipe(ofType("FOO"), tap(() => {}), switchMap(() => EMPTY));
                                                                     ~~~~~~~~~ [forbidden]
      `,
      {
        options: [
          {
            disallow: ["FOO"],
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/rxjs-tslint-rules/issues/50
        import { EMPTY, Observable, of } from "rxjs";
        import { switchMap, tap } from "rxjs/operators";

        function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
          return source => source;
        }

        const actions = of({});
        const that = { actions };

        const Actions = {
          types: {
            GET_SOMETHING: "GET_SOMETHING",
            PUT_SOMETHING: "PUT_SOMETHING",
            GetSomething: GET_SOMETHING,
            PutSomething: PUT_SOMETHING
          }
        };

        const pipedSymbolGetEffect = actions.pipe(ofType(Actions.types.GET_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
        const pipedSymbolPutEffect = actions.pipe(ofType(Actions.types.PUT_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
                                                                                                      ~~~~~~~~~ [forbidden]

        const pipedSymbolGetEffect = that.actions.pipe(ofType(Actions.types.GET_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
        const pipedSymbolPutEffect = that.actions.pipe(ofType(Actions.types.PUT_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
                                                                                                           ~~~~~~~~~ [forbidden]


        const pipedOfTypeCamelCaseGetEffect = actions.pipe(ofType(Actions.types.GetSomething), tap(() => {}), switchMap(() => EMPTY));
        const pipedOfTypeCamelCasePutEffect = actions.pipe(ofType(Actions.types.PutSomething), tap(() => {}), switchMap(() => EMPTY));
                                                                                                              ~~~~~~~~~ [forbidden]

        const pipedOfTypeCamelCaseGetEffect = that.actions.pipe(ofType(Actions.types.GetSomething), tap(() => {}), switchMap(() => EMPTY));
        const pipedOfTypeCamelCasePutEffect = that.actions.pipe(ofType(Actions.types.PutSomething), tap(() => {}), switchMap(() => EMPTY));
                                                                                                                   ~~~~~~~~~ [forbidden]
      `
    ),
  ],
});
