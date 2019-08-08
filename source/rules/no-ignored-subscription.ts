/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import * as ts from "typescript";
import { couldBeType } from "tsutils-etc";
import { getParserServices } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows ignoring the subscription returned by subscribe.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Ignoring returned subscriptions is forbidden."
    },
    schema: []
  },
  create: context => {
    return {
      "ExpressionStatement[expression.callee.property.name='subscribe']:has([expression.arguments.length = 0]) > CallExpression > MemberExpression": (
        node: es.MemberExpression
      ) => {
        const service = getParserServices(context);
        const nodeMap = service.esTreeNodeToTSNodeMap;
        const typeChecker = service.program.getTypeChecker();

        const identifier = nodeMap.get(node.object) as ts.Identifier;
        const identifierType = typeChecker.getTypeAtLocation(identifier);

        if (couldBeType(identifierType, "Observable")) {
          context.report({
            messageId: "forbidden",
            node: node.property
          });
        }
      }
    };
  }
};

export = rule;
