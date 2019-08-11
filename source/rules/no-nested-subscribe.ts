/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import esquery from "esquery";
import * as es from "estree";
import { couldBeType } from "tsutils-etc";
import { getParent, getTypeCheckerAndNodeMap } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Disallows the calling of `subscribe` within a `subscribe` callback.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Nested subscribe calls are forbidden."
    },
    schema: []
  },
  create: context => {
    const { nodeMap, typeChecker } = getTypeCheckerAndNodeMap(context);
    const subscribeQuery =
      "CallExpression > MemberExpression[property.name='subscribe']";

    return {
      [subscribeQuery]: (node: es.MemberExpression) => {
        const identifier = nodeMap.get(node.object);
        const identifierType = typeChecker.getTypeAtLocation(identifier);

        if (!couldBeType(identifierType, "Observable")) {
          return;
        }

        const callExpression = getParent<es.CallExpression>(node);
        callExpression.arguments.forEach(childNode => {
          const childNodes = esquery<es.MemberExpression>(
            childNode,
            subscribeQuery
          );
          childNodes.forEach(childNode => {
            const childIdentifier = nodeMap.get(childNode.object);
            const childIdentifierType = typeChecker.getTypeAtLocation(
              childIdentifier
            );

            if (couldBeType(childIdentifierType, "Observable")) {
              context.report({
                messageId: "forbidden",
                node: childNode.property
              });
            }
          });
        });
      }
    };
  }
};

export = rule;
