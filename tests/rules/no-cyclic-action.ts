/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-cyclic-action");
import { ruleTester } from "../utils";

const setup = stripIndent`
  import { Observable, of } from "rxjs";
  import { mapTo } from "rxjs/operators";

  type Action<T extends string> = { type: T };
  type ActionOfType<T> = T extends string ? Action<T> : never;

  function ofType<T extends readonly string[]>(...types: T): (source: Observable<Action<string>>) => Observable<ActionOfType<T[number]>> {
    return source => source as any;
  }

  type Actions = Observable<Action<string>>;
  const actions = of<Action<string>>();

  const SOMETHING = "SOMETHING";
  const SOMETHING_ELSE = "SOMETHING_ELSE";
`.replace(/\n/g, "");

ruleTester({ types: true }).run("no-cyclic-action", rule, {
  valid: [
    {
      code: stripIndent`
        // effect SOMETHING to SOMETHING_ELSE
        ${setup}
        const a = actions.pipe(ofType("SOMETHING"), mapTo({ type: "SOMETHING_ELSE" as const }));
        const b = actions.pipe(ofType("SOMETHING"), mapTo({ type: SOMETHING_ELSE } as const));
        const c = actions.pipe(ofType(SOMETHING), mapTo({ type: "SOMETHING_ELSE" as const }));
        const d = actions.pipe(ofType(SOMETHING), mapTo({ type: SOMETHING_ELSE } as const));
      `,
    },
    {
      code: stripIndent`
        // epic SOMETHING to SOMETHING_ELSE
        ${setup}
        const a = (action$: Actions) => action$.pipe(ofType("SOMETHING"), mapTo({ type: "SOMETHING_ELSE" as const }));
        const b = (action$: Actions) => action$.pipe(ofType("SOMETHING"), mapTo({ type: SOMETHING_ELSE } as const));
        const c = (action$: Actions) => action$.pipe(ofType(SOMETHING), mapTo({ type: "SOMETHING_ELSE" as const }));
        const d = (action$: Actions) => action$.pipe(ofType(SOMETHING), mapTo({ type: SOMETHING_ELSE } as const));
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/54
        ${setup}
        const a = actions.pipe(ofType("SOMETHING"), map(() => {}));
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // effect SOMETHING to SOMETHING
        ${setup}
        const a = actions.pipe(ofType("SOMETHING"), mapTo({ type: "SOMETHING" as const }));
                  ~~~~~~~~~~~~ [forbidden]
        const b = actions.pipe(ofType("SOMETHING"), mapTo({ type: SOMETHING } as const));
                  ~~~~~~~~~~~~ [forbidden]
        const c = actions.pipe(ofType(SOMETHING), mapTo({ type: "SOMETHING" as const }));
                  ~~~~~~~~~~~~ [forbidden]
        const d = actions.pipe(ofType(SOMETHING), mapTo({ type: SOMETHING } as const));
                  ~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // epic SOMETHING to SOMETHING
        ${setup}
        const a = (action$: Actions) => action$.pipe(ofType("SOMETHING"), mapTo({ type: "SOMETHING" as const }));
                                        ~~~~~~~~~~~~ [forbidden]
        const b = (action$: Actions) => action$.pipe(ofType("SOMETHING"), mapTo({ type: SOMETHING } as const));
                                        ~~~~~~~~~~~~ [forbidden]
        const c = (action$: Actions) => action$.pipe(ofType(SOMETHING), mapTo({ type: "SOMETHING" as const }));
                                        ~~~~~~~~~~~~ [forbidden]
        const d = (action$: Actions) => action$.pipe(ofType(SOMETHING), mapTo({ type: SOMETHING } as const));
                                        ~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // effect SOMETHING | SOMETHING_ELSE to SOMETHING
        ${setup}
        const a = actions.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), mapTo({ type: "SOMETHING" as const }));
                  ~~~~~~~~~~~~ [forbidden]
        const b = actions.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), mapTo({ type: SOMETHING } as const));
                  ~~~~~~~~~~~~ [forbidden]
        const c = actions.pipe(ofType(SOMETHING, SOMETHING_ELSE), mapTo({ type: "SOMETHING" as const }));
                  ~~~~~~~~~~~~ [forbidden]
        const d = actions.pipe(ofType(SOMETHING, SOMETHING_ELSE), mapTo({ type: SOMETHING } as const));
                  ~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // epic SOMETHING | SOMETHING_ELSE to SOMETHING
        ${setup}
        const a = (action$: Actions) => action$.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), mapTo({ type: "SOMETHING" as const }));
                                        ~~~~~~~~~~~~ [forbidden]
        const b = (action$: Actions) => action$.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), mapTo({ type: SOMETHING } as const));
                                        ~~~~~~~~~~~~ [forbidden]
        const c = (action$: Actions) => action$.pipe(ofType(SOMETHING, SOMETHING_ELSE), mapTo({ type: "SOMETHING" as const }));
                                        ~~~~~~~~~~~~ [forbidden]
        const d = (action$: Actions) => action$.pipe(ofType(SOMETHING, SOMETHING_ELSE), mapTo({ type: SOMETHING } as const));
                                        ~~~~~~~~~~~~ [forbidden]
      `
    ),
  ],
});
