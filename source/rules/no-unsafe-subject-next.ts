/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import * as tsutils from "tsutils";
import { couldBeType, isReferenceType, isUnionType } from "tsutils-etc";
import * as ts from "typescript";
import { isMemberExpression, typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Forbids unsafe optional `next` calls.",
      recommended: true,
    },
    fixable: null,
    messages: {
      forbidden: "Unsafe optional next calls are forbidden.",
    },
    schema: [],
  },
  create: (context) => {
    const { nodeMap, typeChecker } = typecheck(context);
    return {
      [`CallExpression[callee.property.name='next']`]: (
        node: es.CallExpression
      ) => {
        if (node.arguments.length === 0 && isMemberExpression(node.callee)) {
          const type = typeChecker.getTypeAtLocation(
            nodeMap.get(node.callee.object)
          );
          if (isReferenceType(type) && couldBeType(type, "Subject")) {
            const [typeArg] = typeChecker.getTypeArguments(type);
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Any)) {
              return;
            }
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Unknown)) {
              return;
            }
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Void)) {
              return;
            }
            if (
              isUnionType(typeArg) &&
              typeArg.types.some((t) =>
                tsutils.isTypeFlagSet(t, ts.TypeFlags.Void)
              )
            ) {
              return;
            }
            context.report({
              messageId: "forbidden",
              node: node.callee.property,
            });
          }
        }
      },
    };
  },
};

export = rule;
