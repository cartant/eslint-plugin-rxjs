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
      description: "Forbids the importation from index modules.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "RxJS imports from index modules are forbidden."
    },
    schema: []
  },
  create: context => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs(?:\u002f\w+)?\u002findex/]`]: (
        node: es.Literal
      ) => {
        context.report({
          messageId: "forbidden",
          node
        });
      }
    };
  }
};

export = rule;
