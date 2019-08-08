/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { couldBeFunction } from "tsutils-etc";
import * as ts from "typescript";
import { getTypeCheckerAndNodeMap } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows operators that return connectable observables.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Connectable observables are forbidden."
    }
  },
  create: context => {
    const { nodeMap, typeChecker } = getTypeCheckerAndNodeMap(context);
    const sourceCode = context.getSourceCode();
    function isConnectableCall(callee: es.CallExpression["callee"]): boolean {
      return (
        callee.type === "Identifier" &&
        /(multicast|publish|publishBehavior|publishLast|publishReplay)/.test(
          sourceCode.getText(callee)
        )
      );
    }
    return {
      CallExpression: (node: es.CallExpression) => {
        const { callee } = node;
        if (isConnectableCall(callee)) {
          let report = false;
          if (sourceCode.getText(callee) === "multicast") {
            report = node.arguments.length === 1;
          } else {
            const callExpression = nodeMap.get(node) as ts.CallExpression;
            report = !callExpression.arguments.some(arg => {
              const type = typeChecker.getTypeAtLocation(arg);
              return couldBeFunction(type);
            });
          }
          if (report) {
            context.report({
              messageId: "forbidden",
              node: callee
            });
          }
        }
      }
    };
  }
};

export = rule;
