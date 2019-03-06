/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { RuleTester } from "eslint";
import rule = require("../../source/rules/no-connectable");
import { configWithTypes } from "../config";

const ruleTester = new RuleTester({
    ...configWithTypes
});
ruleTester.run("no-connectable", rule, {
    valid: [{
        code: `
            const result = of(42).pipe(
                multicast(new Subject(), p => p)
            );
        `
    }, {
        code: `
            const result = of(42).pipe(
                multicast(() => new Subject(), p => p)
            );
        `
    }, {
        code: `
            const selector = p => p;
            const result = of(42).pipe(
                multicast(() => new Subject(), selector)
            );
        `
    }, {
        code: `
            const result = of(42).pipe(
                publish(p => p)
            );
        `
    }, {
        code: `
            const result = of(42).pipe(
                publishReplay(1, p => p)
            );
        `
    }],
    invalid: [{
        code: `
            const result = of(42).pipe(
                publish()
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }]
    }, {
        code: `
            const result = of(42).pipe(
                publishBehavior(1)
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }]
    }, {
        code: `
            const result = of(42).pipe(
                publishLast()
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }]
    }, {
        code: `
            const result = of(42).pipe(
                publishReplay(1)
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }]
    }, {
        code: `
            const result = of(42).pipe(
                multicast(new Subject<number>())
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }]
    }, {
        code: `
            const result = of(42).pipe(
                multicast(() => new Subject<number>())
            );
        `,
        errors: [{
            column: 17,
            line: 3,
            messageId: "forbidden"
        }]
    }]
});
