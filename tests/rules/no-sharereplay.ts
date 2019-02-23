/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { RuleTester } from "eslint";
import rule = require("../../source/rules/no-sharereplay");

const ruleTester = new RuleTester();
ruleTester.run("no-sharereplay", rule, {
    valid: [
        // give me some code that won't trigger a warning
    ],
    invalid: [
        {
            code: "/*no-sharereplay*/",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
