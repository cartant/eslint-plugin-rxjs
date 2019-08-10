/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import * as ts from "typescript";
import { couldBeType } from "tsutils-etc";
import { getTypeCheckerAndNodeMap } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows ignoring the subscription returned by subscribe.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Ignoring returned subscriptions is forbidden."
    },
    schema: []
  },
  create: context => {
    const { nodeMap, typeChecker } = getTypeCheckerAndNodeMap(context);

    return {
      "ExpressionStatement > CallExpression > MemberExpression[property.name='subscribe']": (
        node: es.MemberExpression
      ) => {
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
