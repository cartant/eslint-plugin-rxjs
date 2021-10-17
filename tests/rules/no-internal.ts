/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-internal");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-internal", rule, {
  valid: [
    stripIndent`
      // no internal double quote
      import { concat } from "rxjs";
      import { map } from "rxjs/operators";
    `,
    stripIndent`
      // no internal single quote
      import { concat } from 'rxjs';
      import { map } from 'rxjs/operators';
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // internal double quote
        import { concat } from "rxjs/internal/observable/concat";
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest 0]
        import { map } from "rxjs/internal/operators/map";
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest 1]
      `,
      {
        output: stripIndent`
          // internal double quote
          import { concat } from "rxjs";
          import { map } from "rxjs/operators";
        `,
        suggestions: [
          {
            messageId: "suggest",
            output: stripIndent`
              // internal double quote
              import { concat } from "rxjs";
              import { map } from "rxjs/internal/operators/map";
            `,
          },
          {
            messageId: "suggest",
            output: stripIndent`
              // internal double quote
              import { concat } from "rxjs/internal/observable/concat";
              import { map } from "rxjs/operators";
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // internal single quote
        import { concat } from 'rxjs/internal/observable/concat';
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest 0]
        import { map } from 'rxjs/internal/operators/map';
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest 1]
      `,
      {
        output: stripIndent`
          // internal single quote
          import { concat } from 'rxjs';
          import { map } from 'rxjs/operators';
        `,
        suggestions: [
          {
            messageId: "suggest",
            output: stripIndent`
              // internal single quote
              import { concat } from 'rxjs';
              import { map } from 'rxjs/internal/operators/map';
            `,
          },
          {
            messageId: "suggest",
            output: stripIndent`
              // internal single quote
              import { concat } from 'rxjs/internal/observable/concat';
              import { map } from 'rxjs/operators';
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // internal ajax
        import { ajax } from "rxjs/internal/observable/ajax/ajax";
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          // internal ajax
          import { ajax } from "rxjs";
        `,
        suggestions: [
          {
            messageId: "suggest",
            output: stripIndent`
              // internal ajax
              import { ajax } from "rxjs";
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // internal fetch
        import { fromFetch } from "rxjs/internal/observable/dom/fetch";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          // internal fetch
          import { fromFetch } from "rxjs/fetch";
        `,
        suggestions: [
          {
            messageId: "suggest",
            output: stripIndent`
              // internal fetch
              import { fromFetch } from "rxjs/fetch";
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // internal webSocket
        import { webSocket } from "rxjs/internal/observable/dom/webSocket";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          // internal webSocket
          import { webSocket } from "rxjs/webSocket";
        `,
        suggestions: [
          {
            messageId: "suggest",
            output: stripIndent`
              // internal webSocket
              import { webSocket } from "rxjs/webSocket";
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // internal observable
        import { concat } from "rxjs/internal/observable/concat";
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          // internal observable
          import { concat } from "rxjs";
        `,
        suggestions: [
          {
            messageId: "suggest",
            output: stripIndent`
              // internal observable
              import { concat } from "rxjs";
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // internal operator
        import { map } from "rxjs/internal/operators/map";
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          // internal operator
          import { map } from "rxjs/operators";
        `,
        suggestions: [
          {
            messageId: "suggest",
            output: stripIndent`
              // internal operator
              import { map } from "rxjs/operators";
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // internal scheduled
        import { scheduled } from "rxjs/internal/scheduled/scheduled";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          // internal scheduled
          import { scheduled } from "rxjs";
        `,
        suggestions: [
          {
            messageId: "suggest",
            output: stripIndent`
              // internal scheduled
              import { scheduled } from "rxjs";
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // internal scheduler
        import { asap } from "rxjs/internal/scheduler/asap";
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          // internal scheduler
          import { asap } from "rxjs";
        `,
        suggestions: [
          {
            messageId: "suggest",
            output: stripIndent`
              // internal scheduler
              import { asap } from "rxjs";
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        // internal testing
        import { TestScheduler } from "rxjs/internal/testing/TestScheduler";
                                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          // internal testing
          import { TestScheduler } from "rxjs/testing";
        `,
        suggestions: [
          {
            messageId: "suggest",
            output: stripIndent`
              // internal testing
              import { TestScheduler } from "rxjs/testing";
            `,
          },
        ],
      }
    ),
  ],
});
