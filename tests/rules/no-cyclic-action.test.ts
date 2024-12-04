import { stripIndent } from 'common-tags';
import { noCyclicActionRule } from '../../src/rules/no-cyclic-action';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

const setup = stripIndent`
  import { Observable, of } from "rxjs";
  import { map } from "rxjs/operators";

  type Action<T extends string> = { type: T };
  type ActionOfType<T> = T extends string ? Action<T> : never;

  function ofType<T extends readonly string[]>(...types: T): (source: Observable<Action<string>>) => Observable<ActionOfType<T[number]>> {
    return source => source as any;
  }

  type Actions = Observable<Action<string>>;
  const actions = of<Action<string>>();

  const SOMETHING = "SOMETHING";
  const SOMETHING_ELSE = "SOMETHING_ELSE";
`.replace(/\n/g, '');

ruleTester({ types: true }).run('no-cyclic-action', noCyclicActionRule, {
  valid: [
    {
      code: stripIndent`
        // effect SOMETHING to SOMETHING_ELSE
        ${setup}
        const a = actions.pipe(ofType("SOMETHING"), map(() => ({ type: "SOMETHING_ELSE" as const })));
        const b = actions.pipe(ofType("SOMETHING"), map(() => ({ type: SOMETHING_ELSE }) as const));
        const c = actions.pipe(ofType(SOMETHING), map(() => ({ type: "SOMETHING_ELSE" as const })));
        const d = actions.pipe(ofType(SOMETHING), map(() => ({ type: SOMETHING_ELSE }) as const));
      `,
    },
    {
      code: stripIndent`
        // epic SOMETHING to SOMETHING_ELSE
        ${setup}
        const a = (action$: Actions) => action$.pipe(ofType("SOMETHING"), map(() => ({ type: "SOMETHING_ELSE" as const })));
        const b = (action$: Actions) => action$.pipe(ofType("SOMETHING"), map(() => ({ type: SOMETHING_ELSE }) as const));
        const c = (action$: Actions) => action$.pipe(ofType(SOMETHING), map(() => ({ type: "SOMETHING_ELSE" as const })));
        const d = (action$: Actions) => action$.pipe(ofType(SOMETHING), map(() => ({ type: SOMETHING_ELSE }) as const));
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
        const a = actions.pipe(ofType("SOMETHING"), map(() => ({ type: "SOMETHING" as const })));
                  ~~~~~~~~~~~~ [forbidden]
        const b = actions.pipe(ofType("SOMETHING"), map(() => ({ type: SOMETHING }) as const));
                  ~~~~~~~~~~~~ [forbidden]
        const c = actions.pipe(ofType(SOMETHING), map(() => ({ type: "SOMETHING" as const })));
                  ~~~~~~~~~~~~ [forbidden]
        const d = actions.pipe(ofType(SOMETHING), map(() => ({ type: SOMETHING }) as const));
                  ~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // epic SOMETHING to SOMETHING
        ${setup}
        const a = (action$: Actions) => action$.pipe(ofType("SOMETHING"), map(() => ({ type: "SOMETHING" as const })));
                                        ~~~~~~~~~~~~ [forbidden]
        const b = (action$: Actions) => action$.pipe(ofType("SOMETHING"), map(() => ({ type: SOMETHING }) as const));
                                        ~~~~~~~~~~~~ [forbidden]
        const c = (action$: Actions) => action$.pipe(ofType(SOMETHING), map(() => ({ type: "SOMETHING" as const })));
                                        ~~~~~~~~~~~~ [forbidden]
        const d = (action$: Actions) => action$.pipe(ofType(SOMETHING), map(() => ({ type: SOMETHING }) as const));
                                        ~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // effect SOMETHING | SOMETHING_ELSE to SOMETHING
        ${setup}
        const a = actions.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), map(() => ({ type: "SOMETHING" as const })));
                  ~~~~~~~~~~~~ [forbidden]
        const b = actions.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), map(() => ({ type: SOMETHING }) as const));
                  ~~~~~~~~~~~~ [forbidden]
        const c = actions.pipe(ofType(SOMETHING, SOMETHING_ELSE), map(() => ({ type: "SOMETHING" as const })));
                  ~~~~~~~~~~~~ [forbidden]
        const d = actions.pipe(ofType(SOMETHING, SOMETHING_ELSE), map(() => ({ type: SOMETHING }) as const));
                  ~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // epic SOMETHING | SOMETHING_ELSE to SOMETHING
        ${setup}
        const a = (action$: Actions) => action$.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), map(() => ({ type: "SOMETHING" as const })));
                                        ~~~~~~~~~~~~ [forbidden]
        const b = (action$: Actions) => action$.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), map(() => ({ type: SOMETHING }) as const));
                                        ~~~~~~~~~~~~ [forbidden]
        const c = (action$: Actions) => action$.pipe(ofType(SOMETHING, SOMETHING_ELSE), map(() => ({ type: "SOMETHING" as const })));
                                        ~~~~~~~~~~~~ [forbidden]
        const d = (action$: Actions) => action$.pipe(ofType(SOMETHING, SOMETHING_ELSE), map(() => ({ type: SOMETHING }) as const));
                                        ~~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
