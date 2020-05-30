/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { isIdentifier } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Forbids ignoring the value within `takeWhile`.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Ignoring the value within takeWhile is forbidden.",
    },
    schema: [],
  },
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
};

export = rule;
