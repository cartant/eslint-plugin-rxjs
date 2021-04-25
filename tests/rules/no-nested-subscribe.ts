/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-nested-subscribe");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-nested-subscribe", rule, {
  valid: [
    stripIndent`
      // not nested in next argument
      import { Observable } from "rxjs";
      of(47).subscribe(value => {
        console.log(value);
      })
    `,
    stripIndent`
      // not nested in observer properties
      import { Observable } from "rxjs";
      of(47).subscribe({
        next: value => console.log(value),
        error: value => console.log(value),
        complete: () => console.log(value)
      })
    `,
    stripIndent`
      // not nested in observer methods
      import { Observable } from "rxjs";
      of(47).subscribe({
        next(value) { console.log(value); },
        error(value) { console.log(value); },
        complete() { console.log(value); }
      })
    `,
    stripIndent`
      // prototype property
      import { Observable } from "rxjs";
      const observableSubscribe = Observable.prototype.subscribe;
      expect(Observable.prototype.subscribe).to.equal(observableSubscribe);
    `,
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/38
      import {of} from "rxjs";
      of(3).subscribe(result => {
        const test = result as boolean;
        if(test > 1) {
          console.log(test);
        }
      });
    `,
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/61
      const whatever = {
        subscribe(callback?: (value: unknown) => void) {}
      };
      whatever.subscribe(() => {
        whatever.subscribe(() => {})
      });
    `,
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/67
      import { Observable, of } from "rxjs";
      new Observable<number>(subscriber => {
        of(42).subscribe(subscriber);
      }).subscribe();
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // nested in next argument
        import { of } from "rxjs";
        of("foo").subscribe(
          value => of("bar").subscribe()
                             ~~~~~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // nested in next property
        import { of } from "rxjs";
        of("foo").subscribe({
          next: value => of("bar").subscribe()
                                   ~~~~~~~~~ [forbidden]
        });
      `
    ),
    fromFixture(
      stripIndent`
        // nested in next method
        import { of } from "rxjs";
        of("foo").subscribe({
          next(value) { of("bar").subscribe(); }
                                  ~~~~~~~~~ [forbidden]
        });
      `
    ),
    fromFixture(
      stripIndent`
        // nested in error argument
        import { of } from "rxjs";
        of("foo").subscribe(
          undefined,
          error => of("bar").subscribe()
                             ~~~~~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // nested in error property
        import { of } from "rxjs";
        of("foo").subscribe({
          error: error => of("bar").subscribe()
                                    ~~~~~~~~~ [forbidden]
        });
      `
    ),
    fromFixture(
      stripIndent`
        // nested in error method
        import { of } from "rxjs";
        of("foo").subscribe({
          error(error) { of("bar").subscribe(); }
                                   ~~~~~~~~~ [forbidden]
        });
      `
    ),
    fromFixture(
      stripIndent`
        // nested in complete argument
        import { of } from "rxjs";
        of("foo").subscribe(
          undefined,
          undefined,
          () => of("bar").subscribe()
                          ~~~~~~~~~ [forbidden]
        );
      `
    ),
    fromFixture(
      stripIndent`
        // nested in complete property
        import { of } from "rxjs";
        of("foo").subscribe({
          complete: () => of("bar").subscribe()
                                    ~~~~~~~~~ [forbidden]
        });
      `
    ),
    fromFixture(
      stripIndent`
        // nested in complete method
        import { of } from "rxjs";
        of("foo").subscribe({
          complete() { of("bar").subscribe(); }
                                 ~~~~~~~~~ [forbidden]
        });
      `
    ),
    fromFixture(
      stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/69
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe(
          () => subscribable.subscribe()
                             ~~~~~~~~~ [forbidden]
        );
      `
    ),
  ],
});
