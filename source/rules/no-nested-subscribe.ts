/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { getParent, typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Forbids the calling of `subscribe` within a `subscribe` callback.",
      recommended: true,
    },
    fixable: null,
    messages: {
      forbidden: "Nested subscribe calls are forbidden.",
    },
    schema: [],
  },
  create: (context) => {
    const { couldBeObservable } = typecheck(context);
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
};

export = rule;
