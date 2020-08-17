/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getTypeServices } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description:
        "Enforces the passing of `Error` values to error notifications.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "Passing non-Error values are forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "throw-error",
  create: (context) => {
    const { isAny, couldBeError, couldBeObservable } = getTypeServices(context);

    function checkNode(node: es.Node) {
      if (!isAny(node) && !couldBeError(node)) {
        context.report({
          messageId: "forbidden",
          node,
        });
      }
    }

    return {
      "ThrowStatement > *": checkNode,
      "CallExpression[callee.name='throwError']": (node: es.CallExpression) => {
        if (couldBeObservable(node)) {
          node.arguments.forEach(checkNode);
        }
      },
    };
  },
});

export = rule;
