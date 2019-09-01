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
      description: "Forbids the ignoring of observables returned by functions.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Ignoring a returned Observable is forbidden."
    },
    schema: []
  },
  create: context => {
    const { couldBeObservable } = typecheck(context);

    return {
      "ExpressionStatement > CallExpression": (node: es.CallExpression) => {
        if (couldBeObservable(node)) {
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
