import { stripIndent } from 'common-tags';
import { noTapRule } from '../../src/rules/no-tap';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-tap', noTapRule, {
  valid: [
    stripIndent`
      // no tap
      import { of } from "rxjs";
      import { map } from "rxjs/operators";
      const ob = of(1).pipe(
        map(x => x * 2)
      );
    `,
    stripIndent`
      // no tap with shallow import
      import { map, of } from "rxjs";
      const ob = of(1).pipe(
        map(x => x * 2)
      );
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // tap
        import { of } from "rxjs";
        import { map, tap } from "rxjs/operators";
                      ~~~ [forbidden]
        const ob = of(1).pipe(
          map(x => x * 2),
          tap(value => console.log(value))
        );
      `,
    ),
    fromFixture(
      stripIndent`
        // tap with shallow import
        import { map, of, tap } from "rxjs";
                          ~~~ [forbidden]
        const ob = of(1).pipe(
          map(x => x * 2),
          tap(value => console.log(value))
        );
      `,
    ),
    fromFixture(
      stripIndent`
        // tap alias
        import { of } from "rxjs";
        import { map, tap as tapAlias } from "rxjs/operators";
                      ~~~ [forbidden]
        const ob = of(1).pipe(
          map(x => x * 2),
          tapAlias(value => console.log(value))
        );
      `,
    ),
  ],
});
