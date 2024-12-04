import { stripIndent } from 'common-tags';
import { preferObserverRule } from '../../src/rules/prefer-observer';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('prefer-observer', preferObserverRule, {
  valid: [
    {
      code: stripIndent`
        // allow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
          value => console.log(value)
        );

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          next: value => console.log(value)
        });

        source.pipe(tap(
          value => console.log(value)
        )).subscribe();

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
      `,
      options: [{ allowNext: true }],
    },
    {
      code: stripIndent`
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe();
        source.subscribe(
          value => console.log(value)
        );

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          error(error) { console.log(error); }
        });
        source.subscribe({
          complete() { console.log("complete"); }
        });
        source.subscribe({
          next(value) { console.log(value); },
          error(error) { console.log(error); },
          complete() { console.log("complete"); }
        });

        source.subscribe({
          next: value => console.log(value)
        });
        source.subscribe({
          error: error => console.log(error)
        });
        source.subscribe({
          complete: () => console.log("complete")
        });
        source.subscribe({
          next: value => console.log(value),
          error: error => console.log(error),
          complete: () => console.log("complete")
        });

        source.pipe(tap(
          value => console.log(value)
        )).subscribe();

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          error(error) { console.log(error); }
        })).subscribe();
        source.pipe(tap({
          complete() { console.log("complete"); }
        })).subscribe();
        source.pipe(tap({
          next(value) { console.log(value); },
          error(error) { console.log(error); },
          complete() { console.log("complete"); }
        })).subscribe();

        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
        source.pipe(tap({
          error: error => console.log(error)
        })).subscribe();
        source.pipe(tap({
          complete: () => console.log("complete")
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value),
          error: error => console.log(error),
          complete: () => console.log("complete")
        })).subscribe();
      `,
      options: [{}],
    },
    {
      code: stripIndent`
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          next: value => console.log(value)
        });

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
      `,
      options: [{ allowNext: false }],
    },
    {
      code: stripIndent`
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextObserver = {
          next: (value: number) => { console.log(value); }
        };
        const source = of(42);

        source.subscribe(nextObserver);
        source.pipe(tap(nextObserver));
      `,
      options: [{}],
    },
    {
      code: stripIndent`
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe();
        source.subscribe(
          function (value) { console.log(value); }
        );
        source.pipe(tap(
          function (value) { console.log(value); }
        )).subscribe();
      `,
      options: [{}],
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/61
        const whatever = {
          pipe(...value: unknown[]) {},
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.pipe(() => {});
        whatever.subscribe(() => {});
      `,
      options: [{ allowNext: false }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // default; next, error
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          value => console.log(value),
          error => console.log(error)
        );
      `,
      {
        output: stripIndent`
          // default; next, error
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: value => console.log(value), error: error => console.log(error) }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // default; next, error
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: value => console.log(value), error: error => console.log(error) }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // default; next, error, complete
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          value => console.log(value),
          error => console.log(error),
          () => console.log("complete")
        );
      `,
      {
        output: stripIndent`
          // default; next, error, complete
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // default; next, error, complete
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // default; next, complete
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          value => console.log(value),
          undefined,
          () => console.log("complete")
        );
      `,
      {
        output: stripIndent`
          // default; next, complete
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: value => console.log(value), complete: () => console.log("complete") }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // default; next, complete
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: value => console.log(value), complete: () => console.log("complete") }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // default; error
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          error => console.log(error)
        );
      `,
      {
        output: stripIndent`
          // default; error
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { error: error => console.log(error) }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // default; error
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { error: error => console.log(error) }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // default; error, complete
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          error => console.log(error),
          () => console.log("complete")
        );
      `,
      {
        output: stripIndent`
          // default; error, complete
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { error: error => console.log(error), complete: () => console.log("complete") }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // default; error, complete
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { error: error => console.log(error), complete: () => console.log("complete") }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // default; complete
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          undefined,
          () => console.log("complete")
        );
      `,
      {
        output: stripIndent`
          // default; complete
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { complete: () => console.log("complete") }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // default; complete
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { complete: () => console.log("complete") }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap; next, error
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          value => console.log(value),
          error => console.log(error)
        )).subscribe();
      `,
      {
        output: stripIndent`
          // tap; next, error
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: value => console.log(value), error: error => console.log(error) }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // tap; next, error
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: value => console.log(value), error: error => console.log(error) }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap; next, error, complete
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          value => console.log(value),
          error => console.log(error),
          () => console.log("complete")
        )).subscribe();
      `,
      {
        output: stripIndent`
          // tap; next, error, complete
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // tap; next, error, complete
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap; next, complete
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          value => console.log(value),
          undefined,
          () => console.log("complete")
        )).subscribe();
      `,
      {
        output: stripIndent`
          // tap; next, complete
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: value => console.log(value), complete: () => console.log("complete") }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // tap; next, complete
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: value => console.log(value), complete: () => console.log("complete") }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap; error
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          error => console.log(error)
        )).subscribe();
      `,
      {
        output: stripIndent`
          // tap; error
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { error: error => console.log(error) }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // tap; error
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { error: error => console.log(error) }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap; error, complete
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          error => console.log(error),
          () => console.log("complete")
        )).subscribe();
      `,
      {
        output: stripIndent`
          // tap; error, complete
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { error: error => console.log(error), complete: () => console.log("complete") }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // tap; error, complete
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { error: error => console.log(error), complete: () => console.log("complete") }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // tap; complete
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          undefined,
          () => console.log("complete")
        )).subscribe();
      `,
      {
        output: stripIndent`
          // tap; complete
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { complete: () => console.log("complete") }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // tap; complete
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { complete: () => console.log("complete") }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest 0]
          value => console.log(value)
        );

        source.pipe(tap(
                    ~~~ [forbidden suggest 1]
          value => console.log(value)
        )).subscribe();
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          // disallow-next
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.subscribe(
            { next: value => console.log(value) }
          );

          source.pipe(tap(
            { next: value => console.log(value) }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // disallow-next
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.subscribe(
                { next: value => console.log(value) }
              );

              source.pipe(tap(
                value => console.log(value)
              )).subscribe();
            `,
          },
          {
            messageId: 'forbidden',
            output: stripIndent`
              // disallow-next
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.subscribe(
                value => console.log(value)
              );

              source.pipe(tap(
                { next: value => console.log(value) }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // disallow-next; named; next arrow
        import { of } from "rxjs";

        const nextArrow = (value: number) => { console.log(value); };
        const source = of(42);

        source.subscribe(nextArrow);
               ~~~~~~~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          // disallow-next; named; next arrow
          import { of } from "rxjs";

          const nextArrow = (value: number) => { console.log(value); };
          const source = of(42);

          source.subscribe({ next: nextArrow });
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // disallow-next; named; next arrow
              import { of } from "rxjs";

              const nextArrow = (value: number) => { console.log(value); };
              const source = of(42);

              source.subscribe({ next: nextArrow });
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // disallow-next; named; next named
        import { of } from "rxjs";

        function nextNamed(value: number): void { console.log(value); }
        const source = of(42);

        source.subscribe(nextNamed);
               ~~~~~~~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          // disallow-next; named; next named
          import { of } from "rxjs";

          function nextNamed(value: number): void { console.log(value); }
          const source = of(42);

          source.subscribe({ next: nextNamed });
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // disallow-next; named; next named
              import { of } from "rxjs";

              function nextNamed(value: number): void { console.log(value); }
              const source = of(42);

              source.subscribe({ next: nextNamed });
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // disallow-next; named; next non-arrow
        import { of } from "rxjs";

        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;
        const source = of(42);

        source.subscribe(nextNonArrow);
               ~~~~~~~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          // disallow-next; named; next non-arrow
          import { of } from "rxjs";

          function nextNamed(value: number): void { console.log(value); }
          const nextNonArrow = nextNamed;
          const source = of(42);

          source.subscribe({ next: nextNonArrow });
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // disallow-next; named; next non-arrow
              import { of } from "rxjs";

              function nextNamed(value: number): void { console.log(value); }
              const nextNonArrow = nextNamed;
              const source = of(42);

              source.subscribe({ next: nextNonArrow });
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // disallow-next; tap; named; next arrow
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        const source = of(42);

        source.pipe(tap(nextArrow));
                    ~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          // disallow-next; tap; named; next arrow
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const nextArrow = (value: number) => { console.log(value); };
          const source = of(42);

          source.pipe(tap({ next: nextArrow }));
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // disallow-next; tap; named; next arrow
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const nextArrow = (value: number) => { console.log(value); };
              const source = of(42);

              source.pipe(tap({ next: nextArrow }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // disallow-next; tap; named; next named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        function nextNamed(value: number): void { console.log(value); }
        const source = of(42);

        source.pipe(tap(nextNamed));
                    ~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          // disallow-next; tap; named; next named
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          function nextNamed(value: number): void { console.log(value); }
          const source = of(42);

          source.pipe(tap({ next: nextNamed }));
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // disallow-next; tap; named; next named
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              function nextNamed(value: number): void { console.log(value); }
              const source = of(42);

              source.pipe(tap({ next: nextNamed }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // disallow-next; tap; named; next non-arrow
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;
        const source = of(42);

        source.pipe(tap(nextNonArrow));
                    ~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          // disallow-next; tap; named; next non-arrow
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          function nextNamed(value: number): void { console.log(value); }
          const nextNonArrow = nextNamed;
          const source = of(42);

          source.pipe(tap({ next: nextNonArrow }));
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // disallow-next; tap; named; next non-arrow
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              function nextNamed(value: number): void { console.log(value); }
              const nextNonArrow = nextNamed;
              const source = of(42);

              source.pipe(tap({ next: nextNonArrow }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; next, error
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          function (value) { console.log(value); },
          function (error) { console.log(error); }
        );
      `,
      {
        output: stripIndent`
          // non-arrow functions; next, error
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; next, error
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; next, error, complete
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          function (value) { console.log(value); },
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        );
      `,
      {
        output: stripIndent`
          // non-arrow functions; next, error, complete
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; next, error, complete
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; next, complete
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          function (value) { console.log(value); },
          undefined,
          function () { console.log("complete"); }
        );
      `,
      {
        output: stripIndent`
          // non-arrow functions; next, complete
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; next, complete
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; error
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          function (error) { console.log(error); }
        );
      `,
      {
        output: stripIndent`
          // non-arrow functions; error
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { error: function (error) { console.log(error); } }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; error
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { error: function (error) { console.log(error); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; error, complete
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        );
      `,
      {
        output: stripIndent`
          // non-arrow functions; error, complete
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; error, complete
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; complete
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          undefined,
          function () { console.log("complete"); }
        );
      `,
      {
        output: stripIndent`
          // non-arrow functions; complete
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { complete: function () { console.log("complete"); } }
          );
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; complete
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { complete: function () { console.log("complete"); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; tap; next, error
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          function (value) { console.log(value); },
          function (error) { console.log(error); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          // non-arrow functions; tap; next, error
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; tap; next, error
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; tap; next, error, complete
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          function (value) { console.log(value); },
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          // non-arrow functions; tap; next, error, complete
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; tap; next, error, complete
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; tap; next, complete
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          function (value) { console.log(value); },
          undefined,
          function () { console.log("complete"); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          // non-arrow functions; tap; next, complete
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; tap; next, complete
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; tap; error
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          function (error) { console.log(error); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          // non-arrow functions; tap; error
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { error: function (error) { console.log(error); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; tap; error
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { error: function (error) { console.log(error); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; tap; error, complete
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          // non-arrow functions; tap; error, complete
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; tap; error, complete
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // non-arrow functions; tap; complete
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          undefined,
          function () { console.log("complete"); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          // non-arrow functions; tap; complete
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { complete: function () { console.log("complete"); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
              // non-arrow functions; tap; complete
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { complete: function () { console.log("complete"); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(fn, fn, fn);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ next: fn, error: fn, complete: fn });
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ next: fn, error: fn, complete: fn });
              `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(fn, null, fn);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ next: fn, complete: fn });
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ next: fn, complete: fn });
              `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(null, undefined, fn);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ complete: fn });
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ complete: fn });
              `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(undefined, fn);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ error: fn });
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ error: fn });
              `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(undefined, fn, null);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ error: fn });
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ error: fn });
              `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        // super wrong
        of(42).subscribe(undefined, fn, fn, fn, fn, fn, fn);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          // super wrong
          of(42).subscribe({ error: fn, complete: fn });
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                // super wrong
                of(42).subscribe({ error: fn, complete: fn });
              `,
          },
        ],
      },
    ),

    // tap
    fromFixture(
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(fn, fn, fn));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ next: fn, error: fn, complete: fn }));
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ next: fn, error: fn, complete: fn }));
              `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(fn, null, fn));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ next: fn, complete: fn }));
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ next: fn, complete: fn }));
              `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(null, undefined, fn));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ complete: fn }));
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ complete: fn }));
              `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(undefined, fn));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ error: fn }));
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ error: fn }));
              `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(undefined, fn, null));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ error: fn }));
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ error: fn }));
              `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        // super wrong
        of(42).pipe(tap(undefined, fn, fn, fn, fn, fn, fn));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          // super wrong
          of(42).pipe(tap({ error: fn, complete: fn }));
        `,
        suggestions: [
          {
            messageId: 'forbidden',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                // super wrong
                of(42).pipe(tap({ error: fn, complete: fn }));
              `,
          },
        ],
      },
    ),
  ],
});
