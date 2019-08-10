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
        "Disallows the ignoring of observables returned by functions.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Ignoring a returned Observable is forbidden."
    },
    schema: []
  },
  create: context => {
    const { nodeMap, typeChecker } = getTypeCheckerAndNodeMap(context);

    return {
      "ExpressionStatement > CallExpression": (node: es.CallExpression) => {
        const identifier = nodeMap.get(node);
        const identifierType = typeChecker.getTypeAtLocation(identifier);

        if (couldBeType(identifierType, "Observable")) {
          context.report({
            messageId: "forbidden",
            node
          });
        }
      }
    };
  }
};

export = rule;
