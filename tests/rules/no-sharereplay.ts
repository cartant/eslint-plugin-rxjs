/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */
/* tslint:disable:object-literal-sort-keys */

import { RuleTester } from "eslint";
import rule = require("../../source/rules/no-sharereplay");

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6 }
});
ruleTester.run("no-sharereplay", rule, {
    valid: [{
        code: `
            const shared = of(42).pipe(
                shareReplay({ refCount: true })
            );
        `,
        options: [{ allowConfig: true }]
    }, {
        code: `
            const shared = of(42).pipe(
                shareReplay({ refCount: false })
            );
        `,
        options: [{ allowConfig: true }]
    }],
    invalid: [{
        code: `
            const shared = of(42).pipe(
                shareReplay()
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }]
    }, {
        code: `
            const shared = of(42).pipe(
                shareReplay()
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbiddenWithoutConfig"
        }],
        options: [{ allowConfig: true }]
    }, {
        code: `
            const shared = of(42).pipe(
                shareReplay(1)
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }]
    }, {
        code: `
            const shared = of(42).pipe(
                shareReplay(1, 100)
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }]
    }, {
        code: `
            const shared = of(42).pipe(
                shareReplay(1, 100, asapScheduler)
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }]
    }, {
        code: `
            const shared = of(42).pipe(
                shareReplay({ refCount: true })
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }],
        options: [{ allowConfig: false }]
    }, {
        code: `
            const shared = of(42).pipe(
                shareReplay({ refCount: false })
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }],
        options: [{ allowConfig: false }]
    }]
});
