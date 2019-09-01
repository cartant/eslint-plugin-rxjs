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
        "Forbids importation from locations that depend upon `rxjs-compat`.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "'rxjs-compat'-dependent import locations are forbidden."
    },
    schema: []
  },
  create: context => {
    return {
      "ImportDeclaration Literal[value=/^rxjs\\u002f/]:not(Literal[value=/^rxjs\\u002f(ajax|operators|testing|webSocket)/])": (
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
