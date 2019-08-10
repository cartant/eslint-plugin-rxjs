/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { couldBeType } from "tsutils-etc";
import * as ts from "typescript";
import { getTypeCheckerAndNodeMap } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Disallows the calling of subscribe without specifying arguments.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Calling subscribe without arguments is forbidden."
    },
    schema: []
  },
  create: context => {
    const { nodeMap, typeChecker } = getTypeCheckerAndNodeMap(context);

    return {
      "ExpressionStatement[expression.callee.property.name='subscribe']:has([expression.arguments.length = 0]) > CallExpression > MemberExpression": (
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
