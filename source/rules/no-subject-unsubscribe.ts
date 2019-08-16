/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { couldBeType } from "tsutils-etc";
import { getTypeCheckerAndNodeMap } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Disallows calling the unsubscribe method of a subject instance.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Calling unsubscribe on a subject is forbidden."
    },
    schema: []
  },
  create: context => {
    const { nodeMap, typeChecker } = getTypeCheckerAndNodeMap(context);

    return {
      "MemberExpression[property.name='unsubscribe']": (
        node: es.MemberExpression
      ) => {
        const tsNode = nodeMap.get(node.object);
        const tsType = typeChecker.getTypeAtLocation(tsNode);

        if (couldBeType(tsType, "Subject")) {
          context.report({
            messageId: "forbidden",
            node: node.property
          });
        }
      },
      "ExpressionStatement > CallExpression[callee.property.name='add'][arguments.length > 0]": (
        node: es.CallExpression
      ) => {
        const memberExpression = node.callee as es.MemberExpression;
        const tsNode = nodeMap.get(memberExpression.object);
        const tsType = typeChecker.getTypeAtLocation(tsNode);

        if (couldBeType(tsType, "Subscription")) {
          const arg = node.arguments[0] as es.Identifier;
          const tsArgNode = nodeMap.get(arg);
          const tsArgType = typeChecker.getTypeAtLocation(tsArgNode);

          if (couldBeType(tsArgType, "Subject")) {
            context.report({
              messageId: "forbidden",
              node: arg
            });
          }
        }
      }
    };
  }
};

export = rule;
