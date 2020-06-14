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
      category: "Best Practices",
      description: "Forbids ignoring the subscription returned by `subscribe`.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Ignoring returned subscriptions is forbidden.",
    },
    schema: null,
    type: "problem",
  },
  name: "no-ignored-subscription",
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      "ExpressionStatement > CallExpression > MemberExpression[property.name='subscribe']": (
        node: es.MemberExpression
      ) => {
        if (couldBeObservable(node.object)) {
          context.report({
            messageId: "forbidden",
            node: node.property,
          });
        }
      },
    };
  },
});

export = rule;
