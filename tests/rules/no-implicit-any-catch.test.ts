import { stripIndent } from 'common-tags';
import { noImplicitAnyCatchRule } from '../../src/rules/no-implicit-any-catch';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-implicit-any-catch', noImplicitAnyCatchRule, {
  valid: [
    {
      code: stripIndent`
        // arrow; no parameter
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(() => console.error("Whoops!"))
        );
      `,
    },
    {
      code: stripIndent`
        // non-arrow; no parameter
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function () { console.error("Whoops!"); })
        );
      `,
    },
    {
      code: stripIndent`
        // arrow; explicit unknown; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
        );
      `,
    },
    {
      code: stripIndent`
        // non-arrow; explicit unknown; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
        );
      `,
    },
    {
      code: stripIndent`
        // arrow; explicit unknown; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: stripIndent`
        // non-arrow; explicit unknown; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: stripIndent`
        // arrow; explicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
        );
      `,
    },
    {
      code: stripIndent`
        // non-arrow; explicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: any) { console.error(error); })
        );
      `,
    },
    {
      code: stripIndent`
        // subscribe; arrow; explicit unknown; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
        );
      `,
    },
    {
      code: stripIndent`
        // subscribe; arrow; explicit any; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: any) => console.error(error)
        );
      `,
    },
    {
      code: stripIndent`
        // subscribe observer; arrow; explicit unknown; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
        });
      `,
    },
    {
      code: stripIndent`
        // subscribe observer; arrow; explicit any; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: any) => console.error(error)
        });
      `,
    },
    {
      code: stripIndent`
        // tap; arrow; explicit unknown; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
        ));
      `,
    },
    {
      code: stripIndent`
        // tap; arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: any) => console.error(error)
        ));
      `,
    },
    {
      code: stripIndent`
        // tap observer; arrow; explicit unknown; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
        }));
      `,
    },
    {
      code: stripIndent`
        // tap observer; arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: any) => console.error(error)
        }));
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/61
        const whatever = {
          subscribe(
            next?: (value: unknown) => void,
            error?: (error: unknown) => void
          ) {}
        };
        whatever.subscribe(() => {}, (error) => {});
      `,
      options: [{}],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // arrow; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error) => console.error(error))
                      ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // arrow; implicit any
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError((error: unknown) => console.error(error))
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // arrow; implicit any
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: unknown) => console.error(error))
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(error => console.error(error))
                     ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // arrow; no parentheses; implicit any
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError((error: unknown) => console.error(error))
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // arrow; no parentheses; implicit any
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: unknown) => console.error(error))
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error) { console.error(error); })
                               ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // non-arrow; implicit any
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError(function (error: unknown) { console.error(error); })
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // non-arrow; implicit any
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError(function (error: unknown) { console.error(error); })
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
                      ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // arrow; explicit any; explicit option
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError((error: unknown) => console.error(error))
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // arrow; explicit any; explicit option
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: unknown) => console.error(error))
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: any) { console.error(error); })
                               ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // non-arrow; explicit any; explicit option
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError(function (error: unknown) { console.error(error); })
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // non-arrow; explicit any; explicit option
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError(function (error: unknown) { console.error(error); })
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // arrow; narrowed
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: string) => console.error(error))
                      ~~~~~~~~~~~~~ [narrowed suggest]
        );
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // arrow; narrowed
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: unknown) => console.error(error))
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow; narrowed
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: string) { console.error(error); })
                               ~~~~~~~~~~~~~ [narrowed suggest]
        );
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // non-arrow; narrowed
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError(function (error: unknown) { console.error(error); })
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // subscribe; arrow; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error) => console.error(error)
           ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // subscribe; arrow; implicit any
          import { throwError } from "rxjs";

          throwError("Kaboom!").subscribe(
            undefined,
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // subscribe; arrow; implicit any
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // subscribe; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          error => console.error(error)
          ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          // subscribe; arrow; no parentheses; implicit any
          import { throwError } from "rxjs";

          throwError("Kaboom!").subscribe(
            undefined,
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // subscribe; arrow; no parentheses; implicit any
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // subscribe; arrow; explicit any; explicit option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: any) => console.error(error)
           ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // subscribe; arrow; explicit any; explicit option
          import { throwError } from "rxjs";

          throwError("Kaboom!").subscribe(
            undefined,
            (error: unknown) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // subscribe; arrow; explicit any; explicit option
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // subscribe; arrow; narrowed
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: string) => console.error(error)
           ~~~~~~~~~~~~~ [narrowed suggest]
        );
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // subscribe; arrow; narrowed
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // subscribe observer; arrow; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error) => console.error(error)
                  ~~~~~ [implicitAny suggest]
        });
      `,
      {
        output: stripIndent`
          // subscribe observer; arrow; implicit any
          import { throwError } from "rxjs";

          throwError("Kaboom!").subscribe({
            error: (error: unknown) => console.error(error)
          });
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // subscribe observer; arrow; implicit any
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: unknown) => console.error(error)
              });
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // subscribe observer; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: error => console.error(error)
                 ~~~~~ [implicitAny suggest]
        });
      `,
      {
        output: stripIndent`
          // subscribe observer; arrow; no parentheses; implicit any
          import { throwError } from "rxjs";

          throwError("Kaboom!").subscribe({
            error: (error: unknown) => console.error(error)
          });
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // subscribe observer; arrow; no parentheses; implicit any
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: unknown) => console.error(error)
              });
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // subscribe observer; arrow; explicit any; explicit option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: any) => console.error(error)
                  ~~~~~~~~~~ [explicitAny suggest]
        });
      `,
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // subscribe observer; arrow; explicit any; explicit option
          import { throwError } from "rxjs";

          throwError("Kaboom!").subscribe({
            error: (error: unknown) => console.error(error)
          });
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // subscribe observer; arrow; explicit any; explicit option
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: unknown) => console.error(error)
              });
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // subscribe observer; arrow; narrowed
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: string) => console.error(error)
                  ~~~~~~~~~~~~~ [narrowed suggest]
        });
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // subscribe observer; arrow; narrowed
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: unknown) => console.error(error)
              });
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap; arrow; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error) => console.error(error)
           ~~~~~ [implicitAny suggest]
        ));
      `,
      {
        output: stripIndent`
          // tap; arrow; implicit any
          import { throwError } from "rxjs";
          import { tap } from "rxjs/operators";

          throwError("Kaboom!").pipe(tap(
            undefined,
            (error: unknown) => console.error(error)
          ));
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // tap; arrow; implicit any
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: unknown) => console.error(error)
              ));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          error => console.error(error)
          ~~~~~ [implicitAny suggest]
        ));
      `,
      {
        output: stripIndent`
          // tap; arrow; no parentheses; implicit any
          import { throwError } from "rxjs";
          import { tap } from "rxjs/operators";

          throwError("Kaboom!").pipe(tap(
            undefined,
            (error: unknown) => console.error(error)
          ));
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // tap; arrow; no parentheses; implicit any
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: unknown) => console.error(error)
              ));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap; arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: any) => console.error(error)
           ~~~~~~~~~~ [explicitAny suggest]
        ));
      `,
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // tap; arrow; explicit any; explicit option
          import { throwError } from "rxjs";
          import { tap } from "rxjs/operators";

          throwError("Kaboom!").pipe(tap(
            undefined,
            (error: unknown) => console.error(error)
          ));
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // tap; arrow; explicit any; explicit option
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: unknown) => console.error(error)
              ));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap; arrow; narrowed
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: string) => console.error(error)
           ~~~~~~~~~~~~~ [narrowed suggest]
        ));
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // tap; arrow; narrowed
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: unknown) => console.error(error)
              ));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap observer; arrow; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error) => console.error(error)
                  ~~~~~ [implicitAny suggest]
        }));
      `,
      {
        output: stripIndent`
          // tap observer; arrow; implicit any
          import { throwError } from "rxjs";
          import { tap } from "rxjs/operators";

          throwError("Kaboom!").pipe(tap({
            error: (error: unknown) => console.error(error)
          }));
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // tap observer; arrow; implicit any
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: unknown) => console.error(error)
              }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap observer; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: error => console.error(error)
                 ~~~~~ [implicitAny suggest]
        }));
      `,
      {
        output: stripIndent`
          // tap observer; arrow; no parentheses; implicit any
          import { throwError } from "rxjs";
          import { tap } from "rxjs/operators";

          throwError("Kaboom!").pipe(tap({
            error: (error: unknown) => console.error(error)
          }));
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // tap observer; arrow; no parentheses; implicit any
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: unknown) => console.error(error)
              }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap observer; arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: any) => console.error(error)
                  ~~~~~~~~~~ [explicitAny suggest]
        }));
      `,
      {
        options: [{ allowExplicitAny: false }],
        output: stripIndent`
          // tap observer; arrow; explicit any; explicit option
          import { throwError } from "rxjs";
          import { tap } from "rxjs/operators";

          throwError("Kaboom!").pipe(tap({
            error: (error: unknown) => console.error(error)
          }));
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // tap observer; arrow; explicit any; explicit option
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: unknown) => console.error(error)
              }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap observer; arrow; narrowed
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: string) => console.error(error)
                  ~~~~~~~~~~~~~ [narrowed suggest]
        }));
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              // tap observer; arrow; narrowed
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: unknown) => console.error(error)
              }));
            `,
          },
        ],
      },
    ),
  ],
});
