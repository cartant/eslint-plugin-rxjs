/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { RuleTester } from "eslint";
import rule = require("../../source/rules/no-sharereplay");
import { configWithoutTypes, lines } from "../utils";

const ruleTester = new RuleTester({
    ...configWithoutTypes
});
ruleTester.run("no-sharereplay", rule, {
    valid: [{
        code: lines(
            "const shared = of(42).pipe(",
            "    shareReplay({ refCount: true })",
            ");"
        ),
        options: [{ allowConfig: true }]
    }, {
        code: lines(
            "const shared = of(42).pipe(",
            "    shareReplay({ refCount: false })",
            ");"
        ),
        options: [{ allowConfig: true }]
    }],
    invalid: [{
        code: lines(
            "const shared = of(42).pipe(",
            "    shareReplay()",
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
            "const shared = of(42).pipe(",
            "    shareReplay()",
            ");"
        ),
        errors: [{
            messageId: "forbiddenWithoutConfig",
            line: 2,
            column: 5,
            endLine: 2,
            endColumn: 16
        }],
        options: [{ allowConfig: true }]
    }, {
        code: lines(
            "const shared = of(42).pipe(",
            "    shareReplay(1)",
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
            "const shared = of(42).pipe(",
            "    shareReplay(1, 100)",
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
            "const shared = of(42).pipe(",
            "    shareReplay(1, 100, asapScheduler)",
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
            "const shared = of(42).pipe(",
            "    shareReplay({ refCount: true })",
            ");"
        ),
        errors: [{
            messageId: "forbidden",
            line: 2,
            column: 5,
            endLine: 2,
            endColumn: 16
        }],
        options: [{ allowConfig: false }]
    }, {
        code: lines(
            "const shared = of(42).pipe(",
            "    shareReplay({ refCount: false })",
            ");"
        ),
        errors: [{
            messageId: "forbidden",
            line: 2,
            column: 5,
            endLine: 2,
            endColumn: 16
        }],
        options: [{ allowConfig: false }]
    }]
});
