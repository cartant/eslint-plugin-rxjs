import { stripIndent } from 'common-tags';
import { banOperatorsRule } from '../../src/rules/ban-operators';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('ban-operators', banOperatorsRule, {
  valid: [
    {
      code: stripIndent`
        // root import
        import { of, concat, merge as m, mergeMap as mm } from "rxjs";

        of('a').pipe(concat(of('b')));
        of(1).pipe(m(of(2)));
        of('a').pipe(mm(x => of(x + '1')));
      `,
      options: [{}],
    },
    {
      code: stripIndent`
        // namespace import
        import * as Rx from "rxjs";

        Rx.of('a').pipe(Rx.concat(Rx.of('b')));
        Rx.of(1).pipe(Rx.merge(Rx.of(2)));
        Rx.of('a').pipe(Rx.mergeMap(x => Rx.of(x + '1')));
      `,
      options: [{}],
    },
    {
      code: stripIndent`
        // operators path import (deprecated)
        import { of, concat, merge as m, mergeMap as mm } from "rxjs/operators";

        of('a').pipe(concat(of('b')));
        of(1).pipe(m(of(2)));
        of('a').pipe(mm(x => of(x + '1')));
      `,
      options: [{}],
    },
    stripIndent`
      // no options
      import { of, concat } from "rxjs";

      of('a').pipe(concat(of('b')));
    `,
    {
      code: stripIndent`
        // non-RxJS operator
        import { of } from "rxjs";

        function concat() {}

        of('a').pipe(concat());
      `,
      options: [{ concat: true }],
    },
    {
      code: stripIndent`
        // only within pipe
        import { of, concat } from "rxjs";

        // For performance reasons, we don't lint operators used outside of pipe.
        concat(of('a'));
      `,
      options: [{ concat: true }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // root import
        import { of, concat, merge as m, mergeMap as mm } from "rxjs";

        of('a').pipe(concat(of('b')));
                     ~~~~~~ [forbidden { "name": "concat", "explanation": "" }]
        of(1).pipe(m(of(2)));
                   ~ [forbidden { "name": "merge", "explanation": ": because I say so" }]
        of('a').pipe(mm(x => of(x + '1')));
      `,
      {
        options: [
          {
            concat: true,
            merge: 'because I say so',
            mergeMap: false,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // namespace import
        import * as Rx from "rxjs";

        Rx.of('a').pipe(Rx.concat(Rx.of('b')));
                           ~~~~~~ [forbidden { "name": "concat", "explanation": "" }]
        Rx.of(1).pipe(Rx.merge(Rx.of(2)));
                         ~~~~~ [forbidden { "name": "merge", "explanation": "" }]
        Rx.of('a').pipe(Rx.mergeMap(x => Rx.of(x + '1')));
      `,
      {
        options: [
          {
            concat: true,
            merge: true,
            mergeMap: false,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // operators path import (deprecated)
        import { of, concat, merge as m, mergeMap as mm } from "rxjs/operators";

        of('a').pipe(concat(of('b')));
                     ~~~~~~ [forbidden { "name": "concat", "explanation": "" }]
        of(1).pipe(m(of(2)));
                   ~ [forbidden { "name": "merge", "explanation": ": because I say so" }]
        of('a').pipe(mm(x => of(x + '1')));
      `,
      {
        options: [
          {
            concat: true,
            merge: 'because I say so',
            mergeMap: false,
          },
        ],
      },
    ),
  ],
});
