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
      category: "Best Practices",
      description: "Forbids the importation of internals.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "RxJS imports from internal are forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-internal",
  create: (context) => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs\u002finternal/]`]: (
        node: es.Literal
      ) => {
        context.report({
          messageId: "forbidden",
          node,
        });
      },
    };
  },
});

export = rule;
