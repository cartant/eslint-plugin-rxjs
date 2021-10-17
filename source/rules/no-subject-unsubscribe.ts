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
        "Forbids calling the `unsubscribe` method of a subject instance.",
      recommended: "error",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Calling unsubscribe on a subject is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-subject-unsubscribe",
  create: (context) => {
    const { couldBeSubject, couldBeSubscription } = getTypeServices(context);

    return {
      "MemberExpression[property.name='unsubscribe']": (
        node: es.MemberExpression
      ) => {
        if (couldBeSubject(node.object)) {
          context.report({
            messageId: "forbidden",
            node: node.property,
          });
        }
      },
      "CallExpression[callee.property.name='add'][arguments.length > 0]": (
        node: es.CallExpression
      ) => {
        const memberExpression = node.callee as es.MemberExpression;
        if (couldBeSubscription(memberExpression.object)) {
          const [arg] = node.arguments;
          if (couldBeSubject(arg)) {
            context.report({
              messageId: "forbidden",
              node: arg,
            });
          }
        }
      },
    };
  },
});

export = rule;
