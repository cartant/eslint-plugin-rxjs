/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { couldBeType } from "tsutils-etc";
import { getParent, getTypeCheckerAndNodeMap } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Disallows accessing the value property of a BehaviorSubject instance.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden:
        "Accessing the value property of a BehaviorSubject is forbidden."
    },
    schema: []
  },
  create: context => {
    const { nodeMap, typeChecker } = getTypeCheckerAndNodeMap(context);

    return {
      "Identifier[name=/^(value|getValue)$/]": (node: es.Identifier) => {
        const parent = getParent(node);

        if (!("object" in parent)) {
          return;
        }

        const tsNode = nodeMap.get(parent.object);
        const tsType = typeChecker.getTypeAtLocation(tsNode);

        if (couldBeType(tsType, "BehaviorSubject")) {
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
