/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { couldBeType, isAny } from "tsutils-etc";
import { getTypeCheckerAndNodeMap } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Enforces the passing of Error values to error notifications.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Passing non-Error values are forbidden."
    },
    schema: []
  },
  create: context => {
    const { nodeMap, typeChecker } = getTypeCheckerAndNodeMap(context);

    function report(node: es.Node) {
      const tsNode = nodeMap.get(node);
      const tsType = typeChecker.getTypeAtLocation(tsNode);

      if (!isAny(tsType) && !couldBeType(tsType, "Error")) {
        context.report({
          messageId: "forbidden",
          node
        });
      }
    }

    return {
      "ThrowStatement > *": report,
      "CallExpression[callee.name='throwError']": (node: es.CallExpression) => {
        const tsNode = nodeMap.get(node);
        const tsType = typeChecker.getTypeAtLocation(tsNode);

        if (couldBeType(tsType, "Observable")) {
          node.arguments.forEach(report);
        }
      }
    };
  }
};

export = rule;
