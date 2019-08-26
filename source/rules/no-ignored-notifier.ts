/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import esquery from "esquery";
import * as es from "estree";
import {
  getParent,
  isArrowFunctionExpression,
  isFunctionExpression,
  typecheck
} from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Disallows observables not composed from the `repeatWhen` or `retryWhen` notifier.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Ignoring the notifier is forbidden."
    },
    schema: []
  },
  create: context => {
    const { couldBeMonoTypeOperatorFunction } = typecheck(context);

    return {
      "CallExpression[arguments.length > 0] > Identifier[name=/^(repeatWhen|retryWhen)$/]": (
        node: es.Identifier
      ) => {
        const callExpression = getParent(node) as es.CallExpression;
        if (couldBeMonoTypeOperatorFunction(callExpression)) {
          const [arg] = callExpression.arguments;
          if (isArrowFunctionExpression(arg) || isFunctionExpression(arg)) {
            const [param] = arg.params as es.Identifier[];
            let fail = false;
            if (param) {
              fail =
                esquery(arg.body, `Identifier[name=${param.name}]`).length ===
                0;
            } else {
              fail = true;
            }

            if (fail) {
              context.report({
                messageId: "forbidden",
                node
              });
            }
          }
        }
      }
    };
  }
};

export = rule;
