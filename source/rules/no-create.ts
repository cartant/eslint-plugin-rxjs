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
      description: "Forbids the calling of `Observable.create`.",
      recommended: "error",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Observable.create is forbidden; use new Observable.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-create",
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      "CallExpression > MemberExpression[object.name='Observable'] > Identifier[name='create']":
        (node: es.Identifier) => {
          const memberExpression = getParent(node) as es.MemberExpression;
          if (couldBeObservable(memberExpression.object)) {
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
