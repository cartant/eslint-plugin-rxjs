/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { RuleTester } from "eslint";
import { rule } from "../../source/rules/no-sharereplay";

const ruleTester = new RuleTester();
ruleTester.run("test", rule, {
    valid: [
        // give me some code that won't trigger a warning
    ],
    invalid: [
        {
            code: "/*test*/",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
