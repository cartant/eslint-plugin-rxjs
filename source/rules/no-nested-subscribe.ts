/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import { query } from "eslint-etc";
import * as es from "estree";
import { getParent, typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Forbids the calling of `subscribe` within a `subscribe` callback.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Nested subscribe calls are forbidden."
    },
    schema: []
  },
  create: context => {
    const { couldBeObservable } = typecheck(context);

    const subscribeQuery =
      "CallExpression > MemberExpression[property.name='subscribe']";

    return {
      [subscribeQuery]: (node: es.MemberExpression) => {
        if (!couldBeObservable(node.object)) {
          return;
        }

        const callExpression = getParent(node) as es.CallExpression;
        callExpression.arguments.forEach(childNode => {
          const childNodes = query(
            childNode,
            subscribeQuery
          ) as es.MemberExpression[];
          childNodes.forEach(childNode => {
            if (couldBeObservable(childNode.object)) {
              context.report({
                messageId: "forbidden",
                node: childNode.property
              });
            }
          });
        });
      }
    };
  }
};

export = rule;
