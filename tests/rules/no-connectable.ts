/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { RuleTester } from "eslint";
import rule = require("../../source/rules/no-connectable");
import { configWithTypes, lines } from "../utils";

const ruleTester = new RuleTester({
    ...configWithTypes
});
ruleTester.run("no-connectable", rule, {
    valid: [{
        code: lines(
            "const result = of(42).pipe(",
            "    multicast(new Subject(), p => p)",
            ");"
        )
    }, {
        code: lines(
            "const result = of(42).pipe(",
            "    multicast(() => new Subject(), p => p)",
            ");"
        )
    }, {
        code: lines(
            "const selector = p => p;",
            "const result = of(42).pipe(",
            "    multicast(() => new Subject(), selector)",
            ");"
        )
    }, {
        code: lines(
            "const result = of(42).pipe(",
            "    publish(p => p)",
            ");"
        )
    }, {
        code: lines(
            "const result = of(42).pipe(",
            "    publishReplay(1, p => p)",
            ");"
        )
    }],
    invalid: [{
        code: lines(
            "const result = of(42).pipe(",
            "    publish()",
            ");"
        ),
        errors: [{
            messageId: "forbidden",
            line: 2,
            column: 5,
            endLine: 2,
            endColumn: 12
        }]
    }, {
        code: lines(
            "const result = of(42).pipe(",
            "    publishBehavior(1)",
            ");"
        ),
        errors: [{
            messageId: "forbidden",
            line: 2,
            column: 5,
            endLine: 2,
            endColumn: 20
        }]
    }, {
        code: lines(
            "const result = of(42).pipe(",
            "    publishLast()",
            ");"
        ),
        errors: [{
            messageId: "forbidden",
            line: 2,
            column: 5,
            endLine: 2,
            endColumn: 16
        }]
    }, {
        code: lines(
            "const result = of(42).pipe(",
            "    publishReplay(1)",
            ");"
        ),
        errors: [{
            messageId: "forbidden",
            line: 2,
            column: 5,
            endLine: 2,
            endColumn: 18
        }]
    }, {
        code: lines(
            "const result = of(42).pipe(",
            "    multicast(new Subject<number>())",
            ");"
        ),
        errors: [{
            messageId: "forbidden",
            line: 2,
            column: 5,
            endLine: 2,
            endColumn: 14
        }]
    }, {
        code: lines(
            "const result = of(42).pipe(",
            "    multicast(() => new Subject<number>())",
            ");"
        ),
        errors: [{
            messageId: "forbidden",
            line: 2,
            column: 5,
            endLine: 2,
            endColumn: 14
        }]
    }]
});
