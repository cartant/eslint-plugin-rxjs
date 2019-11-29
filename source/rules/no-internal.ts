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
      description: "Forbids the importation of internals.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "RxJS imports from internal are forbidden."
    },
    schema: []
  },
  create: context => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs\u002finternal/]`]: (
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
