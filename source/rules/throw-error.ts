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
        "Enforces the passing of Error values to error notifications.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Passing non-Error values are forbidden."
    },
    schema: []
  },
  create: context => {
    const { isAny, couldBeError, couldBeObservable } = typecheck(context);

    function report(node: es.Node) {
      if (!isAny(node) && !couldBeError(node)) {
        context.report({
          messageId: "forbidden",
          node
        });
      }
    }

    return {
      "ThrowStatement > *": report,
      "CallExpression[callee.name='throwError']": (node: es.CallExpression) => {
        if (couldBeObservable(node)) {
          node.arguments.forEach(report);
        }
      }
    };
  }
};

export = rule;
