/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { couldBeFunction } from "tsutils-etc";
import * as ts from "typescript";
import { ruleCreator, typecheck } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids operators that return connectable observables.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Connectable observables are forbidden.",
    },
    schema: null,
    type: "problem",
  },
  name: "no-connectable",
  create: (context) => {
    const { nodeMap, typeChecker } = typecheck(context);
    return {
      "CallExpression[callee.name='multicast']": (node: es.CallExpression) => {
        if (node.arguments.length === 1) {
          context.report({
            messageId: "forbidden",
            node: node.callee,
          });
        }
      },
      "CallExpression[callee.name=/^(publish|publishBehavior|publishLast|publishReplay)$/]": (
        node: es.CallExpression
      ) => {
        const callExpression = nodeMap.get(node) as ts.CallExpression;
        if (
          !callExpression.arguments.some((arg) =>
            couldBeFunction(typeChecker.getTypeAtLocation(arg))
          )
        ) {
          context.report({
            messageId: "forbidden",
            node: node.callee,
          });
        }
      },
    };
  },
});

export = rule;
