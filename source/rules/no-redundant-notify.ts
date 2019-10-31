/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Forbids redundant notifications from completed or errored observables.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Redundant notifications are forbidden."
    },
    schema: []
  },
  create: context => {
    return {};
  }
};

export = rule;
