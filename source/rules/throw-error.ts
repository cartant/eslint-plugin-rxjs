/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getParserServices, getTypeServices } from "eslint-etc";
import { couldBeFunction, couldBeType, isAny } from "tsutils-etc";
import * as ts from "typescript";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Enforces the passing of `Error` values to error notifications.",
      recommended: false,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Passing non-Error values are forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "throw-error",
  create: (context) => {
    const { esTreeNodeToTSNodeMap, program } = getParserServices(context);
    const { couldBeObservable, getType } = getTypeServices(context);

    function checkNode(node: es.Node) {
      let type = getType(node);
      if (couldBeFunction(type)) {
        const tsNode = esTreeNodeToTSNodeMap.get(node);
        const annotation = (tsNode as ts.ArrowFunction).type;
        const body = (tsNode as ts.ArrowFunction).body;
        type = program.getTypeChecker().getTypeAtLocation(annotation ?? body);
      }
      if (!isAny(type) && !couldBeType(type, /^(Error|DOMException)$/)) {
        context.report({
          messageId: "forbidden",
          node,
        });
      }
    }

    return {
      "ThrowStatement > *": checkNode,
      "CallExpression[callee.name='throwError']": (node: es.CallExpression) => {
        if (couldBeObservable(node)) {
          const [arg] = node.arguments;
          if (arg) {
            checkNode(arg);
          }
        }
      },
    };
  },
});

export = rule;
