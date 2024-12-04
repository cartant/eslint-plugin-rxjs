import { stripIndent } from 'common-tags';
import { noIgnoredDefaultValueRule } from '../../src/rules/no-ignored-default-value';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-default-value', noIgnoredDefaultValueRule, {
  valid: [
    stripIndent`
      // firstValueFrom with default value
      import { firstValueFrom, of } from "rxjs";

      firstValueFrom(of(42), { defaultValue: 0 });
      firstValueFrom(of(42), { defaultValue: null });
      firstValueFrom(of(42), { defaultValue: undefined });
      function getValue(obs) {
        return firstValueFrom(obs, { defaultValue: "hello" });
      }
      class Foo {
        getValue(obs) {
          return firstValueFrom(obs, { defaultValue: "world" });
        }
      }
    `,
    stripIndent`
      // lastValueFrom with default value
      import { lastValueFrom, of } from "rxjs";

      lastValueFrom(of(42), { defaultValue: 0 });
      lastValueFrom(of(42), { defaultValue: null });
      lastValueFrom(of(42), { defaultValue: undefined });
    `,
    stripIndent`
      // first with default value
      import { first, of } from "rxjs";

      of(42).pipe(first(x => x, { defaultValue: 0 }));
      of(42).pipe(first(x => x, { defaultValue: null }));
      of(42).pipe(first(x => x, { defaultValue: undefined }));
    `,
    stripIndent`
      // last with default value
      import { last, of } from "rxjs";

      of(42).pipe(last(x => x, { defaultValue: 0 }));
      of(42).pipe(last(x => x, { defaultValue: null }));
      of(42).pipe(last(x => x, { defaultValue: undefined }));
    `,
    stripIndent`
      // other operators
      import { of, map, filter, refCount } from "rxjs";

      of(42).pipe(map(x => x), filter(x => x > 0), shareReplay({ bufferSize: 1, refCount: true }));
    `,
    stripIndent`
      // non-RxJS firstValueFrom
      import { of } from "rxjs";

      function firstValueFrom(obs) {}
      firstValueFrom(of(42));

      class Foo {
        firstValueFrom(obs) {}
      }
      const myFoo = new Foo();
      myFoo.firstValueFrom(of(42));
    `,
    stripIndent`
      // non-RxJS lastValueFrom
      import { of } from "rxjs";

      function lastValueFrom(obs) {}
      lastValueFrom(of(42));
    `,
    stripIndent`
      // non-RxJS first
      import { of } from "rxjs";

      function first() {}
      of(42).pipe(first());
    `,
    stripIndent`
      // non-RxJS last
      import { of } from "rxjs";

      function last() {}
      of(42).pipe(last());
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // firstValueFrom ignored
        import { firstValueFrom, of } from "rxjs";

        firstValueFrom(of(42));
        ~~~~~~~~~~~~~~ [forbidden]
        firstValueFrom(of(42), {});
                               ~~ [forbidden]
        const config = {};
        firstValueFrom(of(42), config);
                               ~~~~~~ [forbidden]
        const config2 = { config: {} };
        firstValueFrom(of(42), config2.config);
                                       ~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // lastValueFrom ignored
        import { lastValueFrom, of } from "rxjs";

        lastValueFrom(of(42));
        ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // first ignored
        import { first, of } from "rxjs";

        of(42).pipe(first());
                    ~~~~~ [forbidden]
        of(42).pipe(first({}));
                          ~~ [forbidden]
        const config = {};
        of(42).pipe(first(config));
                          ~~~~~~ [forbidden]
        const config2 = { config: {} };
        of(42).pipe(first(config2.config));
                                  ~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // last ignored
        import { last, of } from "rxjs";

        of(42).pipe(last());
                    ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // namespace import
        import * as Rx from "rxjs";

        Rx.firstValueFrom(Rx.of(42));
           ~~~~~~~~~~~~~~ [forbidden]
        Rx.of(42).pipe(Rx.first());
                          ~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // operators import (deprecated)
        import { of } from "rxjs";
        import { first, last } from "rxjs/operators";

        of(42).pipe(first());
                    ~~~~~ [forbidden]
        of(42).pipe(last());
                    ~~~~ [forbidden]
      `,
    ),
  ],
});
