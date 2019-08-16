/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import esquery from "esquery";
import * as es from "estree";
import { typecheck, isCallExpression, isMemberExpression } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows the passing of unbound methods.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Unbound methods are forbidden."
    },
    schema: []
  },
  create: context => {
    const { couldBeObservable, couldBeSubscription, getTSType } = typecheck(
      context
    );

    function report(node: es.CallExpression) {
      node.arguments.filter(isMemberExpression).forEach(arg => {
        const argType = getTSType(arg);
        if (argType.getCallSignatures().length > 0) {
          const thisExpressions = esquery(
            arg,
            "ThisExpression"
          ) as es.ThisExpression[];
          if (thisExpressions.length > 0) {
            context.report({
              messageId: "forbidden",
              node: arg
            });
          }
        }
      });
    }

    function isObservableOrSubscription(
      node: es.CallExpression,
      reportFn: typeof report
    ) {
      if (!isMemberExpression(node.callee)) {
        return;
      }

      if (
        couldBeObservable(node.callee.object) ||
        couldBeSubscription(node.callee.object)
      ) {
        reportFn(node);
      }
    }

    return {
      "CallExpression[callee.property.name='pipe']": (
        node: es.CallExpression
      ) => {
        isObservableOrSubscription(node, ({ arguments: args }) => {
          args.filter(isCallExpression).forEach(report);
        });
      },
      "CallExpression[callee.property.name=/^(add|subscribe)$/]": (
        node: es.CallExpression
      ) => {
        isObservableOrSubscription(node, report);
      },
      "NewExpression[callee.name='Subscription']": report
    };
  }
};

export = rule;
