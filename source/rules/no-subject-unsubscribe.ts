/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { typecheck } from "../utils";

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
    const { couldBeSubject, couldBeSubscription } = typecheck(context);

    return {
      "MemberExpression[property.name='unsubscribe']": (
        node: es.MemberExpression
      ) => {
        if (couldBeSubject(node.object)) {
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
        if (couldBeSubscription(memberExpression.object)) {
          const [arg] = node.arguments;
          if (couldBeSubject(arg)) {
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
