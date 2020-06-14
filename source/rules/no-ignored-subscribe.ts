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
      description:
        "Forbids the calling of `subscribe` without specifying arguments.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Calling subscribe without arguments is forbidden.",
    },
    schema: null,
    type: "problem",
  },
  name: "no-ignored-subscribe",
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      "CallExpression[arguments.length = 0][callee.property.name='subscribe']": (
        node: es.CallExpression
      ) => {
        const callee = node.callee as es.MemberExpression;
        if (couldBeObservable(callee.object)) {
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
