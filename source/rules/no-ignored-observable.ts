/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getTypeServices } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: "Forbids the ignoring of observables returned by functions.",
      recommended: false,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Ignoring a returned Observable is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-ignored-observable",
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      "ExpressionStatement > CallExpression": (node: es.CallExpression) => {
        if (couldBeObservable(node)) {
          context.report({
            messageId: "forbidden",
            node,
          });
        }
      },
    };
  },
});

export = rule;
