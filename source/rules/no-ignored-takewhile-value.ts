/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { isIdentifier } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Possible Errors",
      description: "Forbids ignoring the value within `takeWhile`.",
      recommended: "error",
    },
    fixable: undefined,
    messages: {
      forbidden: "Ignoring the value within takeWhile is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-ignored-takewhile-value",
  create: (context) => {
    function checkNode(
      expression: es.ArrowFunctionExpression | es.FunctionExpression
    ) {
      let ignored = true;
      const scope = context.getScope();
      const [param] = expression.params;
      if (param && isIdentifier(param)) {
        const variable = scope.variables.find(
          ({ name }) => name === param.name
        );
        if (variable && variable.references.length > 0) {
          ignored = false;
        }
      }
      if (ignored) {
        context.report({
          messageId: "forbidden",
          node: expression,
        });
      }
    }

    return {
      "CallExpression[callee.name='takeWhile'] > ArrowFunctionExpression": (
        node: es.ArrowFunctionExpression
      ) => checkNode(node),
      "CallExpression[callee.name='takeWhile'] > FunctionExpression": (
        node: es.FunctionExpression
      ) => checkNode(node),
    };
  },
});

export = rule;
