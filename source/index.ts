/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

const rules = require("requireindex")(`${__dirname}/rules`);
Object.keys(rules).forEach(key => rules[key] = rules[key].rule);
module.exports.rules = rules;
