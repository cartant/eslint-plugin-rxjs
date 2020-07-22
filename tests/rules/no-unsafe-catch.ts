/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
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
`.replace(/\n/g, "");

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
    fromFixture(
      stripIndent`
        // unsafe actions
        ${setup}
        const unsafePipedOfTypeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
          ~~~~~~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // unsafe actions property
        ${setup}
        const unsafePipedOfTypeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
          ~~~~~~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // unsafe epic
        ${setup}
        const unsafePipedOfTypeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
          ~~~~~~~~~~ [forbidden]
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
          catchError(() => EMPTY)
          ~~~~~~~~~~ [forbidden]
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
    fromFixture(
      stripIndent`
        // https://github.com/cartant/rxjs-tslint-rules/issues/96
        import { Observable } from "rxjs";
        import { catchError, map } from "rxjs/operators";

        class SomeComponent {

          actions$: Observable<Action>;

          @Effect()
          initialiseAppointments$ = this.actions$.pipe(
            ofType(AppointmentsActions.Type.Initialise),
            this.getAppointmentSessionParametersFromURL(),
            this.updateAppointmentSessionIfDeprecated(),
            map(
              (appointmentSession: AppointmentSession) =>
                new AppointmentsActions.InitialiseSuccess(appointmentSession)
            ),
            catchError(() => of(new AppointmentsActions.InitialiseError())),
            ~~~~~~~~~~ [forbidden]
          );
        }
      `
    ),
  ],
});
