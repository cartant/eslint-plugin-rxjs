/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { isCallExpression, isIdentifier, typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows unsafe first/take usage in Effects and epics.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden:
        "Unsafe `first` and `take` usage in Effects and epics are forbidden."
    },
    schema: [
      {
        properties: {
          observable: { type: "string" }
        },
        type: "object"
      }
    ]
  },
  create: context => {
    const defaultObservable = "action(s|\\$)?";
    const invalidOperators = ["take", "first"];

    const [config] = context.options;
    const { observable = defaultObservable } = config || {};
    const observableRegExp = new RegExp(observable);

    const { couldBeObservable, isReferenceType } = typecheck(context);

    return {
      [`VariableDeclarator CallExpression:has(MemberExpression:matches([object.name=${observableRegExp}], [object.property.name=${observableRegExp}]))[callee.property.name='pipe'][arguments]:has(CallExpression[callee.name=/^(take|first)$/])`]: (
        node: es.CallExpression
      ) => {
        if (!isReferenceType(node) || !couldBeObservable(node)) {
          return;
        }

        node.arguments.forEach(arg => {
          if (isCallExpression(arg) && isIdentifier(arg.callee)) {
            if (invalidOperators.includes(arg.callee.name)) {
              context.report({
                messageId: "forbidden",
                node: arg.callee
              });
            }
          }
        });
      }
    };
  }
};

export = rule;
