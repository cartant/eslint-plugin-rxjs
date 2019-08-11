/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import esquery from "esquery";
import * as es from "estree";
import { couldBeType } from "tsutils-etc";
import {
  getTypeCheckerAndNodeMap,
  isCallExpression,
  isMemberExpression
} from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows the passing of unbound methods.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Unbound methods are forbidden."
    },
    schema: []
  },
  create: context => {
    const { nodeMap, typeChecker } = getTypeCheckerAndNodeMap(context);

    function report(node: es.CallExpression) {
      node.arguments.filter(isMemberExpression).forEach(arg => {
        const argNode = nodeMap.get(arg);
        const argType = typeChecker.getTypeAtLocation(argNode);
        if (argType.getCallSignatures().length > 0) {
          const thisExpressions = esquery<es.ThisExpression>(
            arg,
            "ThisExpression"
          );
          if (thisExpressions.length > 0) {
            context.report({
              messageId: "forbidden",
              node: arg
            });
          }
        }
      });
    }

    function isObservableOrSubscription(
      node: es.CallExpression,
      reportFn: typeof report
    ) {
      if (!isMemberExpression(node.callee)) {
        return;
      }

      const memberExpression = nodeMap.get(node.callee.object);
      const memberExpressionType = typeChecker.getTypeAtLocation(
        memberExpression
      );

      if (couldBeType(memberExpressionType, /^(Observable|Subscription)$/)) {
        reportFn(node);
      }
    }

    return {
      "CallExpression[callee.property.name='pipe']": (
        node: es.CallExpression
      ) => {
        isObservableOrSubscription(node, ({ arguments: args }) => {
          args.filter(isCallExpression).forEach(report);
        });
      },
      "CallExpression[callee.property.name=/^(add|subscribe)$/]": (
        node: es.CallExpression
      ) => {
        isObservableOrSubscription(node, report);
      },
      "NewExpression[callee.name='Subscription']": report
    };
  }
};

export = rule;
