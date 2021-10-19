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
      description:
        "Forbids the calling of `subscribe` with arguments.",
      recommended: false,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Calling subscribe with arguments is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-subscribe-callbacks",
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    return {
      "CallExpression[arguments.length > 0][callee.property.name='subscribe']":
        (node: es.CallExpression) => {
          const callee = node.callee as es.MemberExpression;
          if (
            couldBeObservable(callee.object) ||
            couldBeType(callee.object, "Subscribable")
          ) {
            context.report({
              messageId: "forbidden",
              node: callee.property,
            });
          }
        },
    };
  },
});

export = rule;
