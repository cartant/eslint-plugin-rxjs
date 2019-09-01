/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { couldBeFunction } from "tsutils-etc";
import * as ts from "typescript";
import { typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Forbids operators that return connectable observables.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Connectable observables are forbidden."
    }
  },
  create: context => {
    const { nodeMap, typeChecker } = typecheck(context);
    return {
      "CallExpression[callee.name='multicast']": (node: es.CallExpression) => {
        if (node.arguments.length === 1) {
          context.report({
            messageId: "forbidden",
            node: node.callee
          });
        }
      },
      "CallExpression[callee.name=/^(publish|publishBehavior|publishLast|publishReplay)$/]": (
        node: es.CallExpression
      ) => {
        const callExpression = nodeMap.get(node) as ts.CallExpression;
        if (
          !callExpression.arguments.some(arg =>
            couldBeFunction(typeChecker.getTypeAtLocation(arg))
          )
        ) {
          context.report({
            messageId: "forbidden",
            node: node.callee
          });
        }
      }
    };
  }
};

export = rule;
