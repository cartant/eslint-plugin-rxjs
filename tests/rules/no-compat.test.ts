import { stripIndent } from 'common-tags';
import { noCompatRule } from '../../src/rules/no-compat';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-compat', noCompatRule, {
  valid: [
    `import { Observable } from "rxjs";`,
    `import { ajax } from "rxjs/ajax";`,
    `import { fromFetch } from "rxjs/fetch";`,
    `import { concatMap } from "rxjs/operators";`,
    `import { TestScheduler } from "rxjs/testing";`,
    `import { webSocket } from "rxjs/webSocket";`,
    `import * as prefixedPackage from "rxjs-prefixed-package";`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import * as Rx from "rxjs/Rx";
                            ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        import { Observable } from "rxjs/Observable";
                                   ~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        import { Subject } from "rxjs/Subject";
                                ~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        import { merge } from "rxjs/observable/merge";
                              ~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        import { merge } from "rxjs/operator/merge";
                              ~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        import { asap } from "rxjs/scheduler/asap";
                             ~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        import "rxjs/add/observable/merge";
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        import "rxjs/add/operator/mergeMap";
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
