import { stripIndent } from 'common-tags';
import { noTopromiseRule } from '../../src/rules/no-topromise';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-topromise', noTopromiseRule, {
  valid: [
    stripIndent`
      // no toPromise
      import { of, Subject } from "rxjs";
      const a = of("a");
      a.subscribe(value => console.log(value));
    `,
    stripIndent`
      // non-observable toPromise
      const a = {
        toPromise() {
          return Promise.resolve("a");
        }
      };
      a.toPromise().then(value => console.log(value));
    `,
    stripIndent`
      // no imports
      class Observable {
        toPromise() {
          return Promise.resolve("a");
        }
      }
      const a = new Observable();
      a.toPromise().then(value => console.log(value));
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // observable toPromise
        import { of } from "rxjs";
        const a = of("a");
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden suggest 0 1]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              // observable toPromise
              import { of, lastValueFrom } from "rxjs";
              const a = of("a");
              lastValueFrom(a).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              // observable toPromise
              import { of, firstValueFrom } from "rxjs";
              const a = of("a");
              firstValueFrom(a).then(value => console.log(value));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // subject toPromise
        import { Subject } from "rxjs";
        const a = new Subject<string>();
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden suggest 0 1]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              // subject toPromise
              import { Subject, lastValueFrom } from "rxjs";
              const a = new Subject<string>();
              lastValueFrom(a).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              // subject toPromise
              import { Subject, firstValueFrom } from "rxjs";
              const a = new Subject<string>();
              firstValueFrom(a).then(value => console.log(value));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // weird whitespace
        import { of } from "rxjs";
        const a = { foo$: of("a") };
        a
          .foo$
          .toPromise().then(value => console.log(value))
           ~~~~~~~~~ [forbidden suggest 0 1]
          .catch(error => console.error(error));
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              // weird whitespace
              import { of, lastValueFrom } from "rxjs";
              const a = { foo$: of("a") };
              lastValueFrom(a
                .foo$).then(value => console.log(value))
                .catch(error => console.error(error));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              // weird whitespace
              import { of, firstValueFrom } from "rxjs";
              const a = { foo$: of("a") };
              firstValueFrom(a
                .foo$).then(value => console.log(value))
                .catch(error => console.error(error));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // lastValueFrom already imported
        import { lastValueFrom as lvf, of } from "rxjs";
        const a = of("a");
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden suggest 0 1]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              // lastValueFrom already imported
              import { lastValueFrom as lvf, of } from "rxjs";
              const a = of("a");
              lvf(a).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              // lastValueFrom already imported
              import { lastValueFrom as lvf, of, firstValueFrom } from "rxjs";
              const a = of("a");
              firstValueFrom(a).then(value => console.log(value));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // rxjs not already imported
        import { fromFetch } from "rxjs/fetch";

        const a = fromFetch("https://api.some.com");
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden suggest 0 1]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              // rxjs not already imported
              import { fromFetch } from "rxjs/fetch";
              import { lastValueFrom } from "rxjs";

              const a = fromFetch("https://api.some.com");
              lastValueFrom(a).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              // rxjs not already imported
              import { fromFetch } from "rxjs/fetch";
              import { firstValueFrom } from "rxjs";

              const a = fromFetch("https://api.some.com");
              firstValueFrom(a).then(value => console.log(value));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // namespace import
        import * as Rx from "rxjs";
        const a = Rx.of("a");
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden suggest 0 1]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              // namespace import
              import * as Rx from "rxjs";
              const a = Rx.of("a");
              Rx.lastValueFrom(a).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              // namespace import
              import * as Rx from "rxjs";
              const a = Rx.of("a");
              Rx.firstValueFrom(a).then(value => console.log(value));
            `,
          },
        ],
      },
    ),
  ],
});
