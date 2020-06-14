/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getParent, getTypeServices } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description:
        "Forbids the calling of `subscribe` within a `subscribe` callback.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Nested subscribe calls are forbidden.",
    },
    schema: null,
    type: "problem",
  },
  name: "no-nested-subscribe",
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);
    const subscribeCallMap = new WeakMap<es.Node, void>();
    return {
      [`CallExpression > MemberExpression[property.name='subscribe']`]: (
        node: es.MemberExpression
      ) => {
        if (!couldBeObservable(node.object)) {
          return;
        }
        const callExpression = getParent(node) as es.CallExpression;
        let parent = getParent(callExpression);
        while (parent) {
          if (subscribeCallMap.has(parent)) {
            context.report({
              messageId: "forbidden",
              node: node.property,
            });
            return;
          }
          parent = getParent(parent);
        }
        subscribeCallMap.set(callExpression);
      },
    };
  },
});

export = rule;
