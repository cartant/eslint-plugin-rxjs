/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Forbids importation from locations that depend upon `rxjs-compat`.",
      recommended: false,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "'rxjs-compat'-dependent import locations are forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-compat",
  create: (context) => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs\u002f/]:not(Literal[value=/^rxjs\u002f(ajax|fetch|testing|webSocket)/])`]:
        (node: es.Literal) => {
          context.report({
            messageId: "forbidden",
            node,
          });
        },
    };
  },
});

export = rule;
