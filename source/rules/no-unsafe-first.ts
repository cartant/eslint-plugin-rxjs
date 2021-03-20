/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { stripIndent } from "common-tags";
import { getTypeServices, isCallExpression, isIdentifier } from "eslint-etc";
import { defaultObservable } from "../constants";
import { ruleCreator } from "../utils";

const defaultOptions: readonly {
  observable?: string;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Possible Errors",
      description: "Forbids unsafe `first`/`take` usage in effects and epics.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden:
        "Unsafe first and take usage in effects and epics are forbidden.",
    },
    schema: [
      {
        properties: {
          observable: { type: "string" },
        },
        type: "object",
        description: stripIndent`
          An optional object with an optional \`observable\` property.
          The property can be specified as a regular expression string and is used to identify the action observables from which effects and epics are composed.`,
      },
    ],
    type: "problem",
  },
  name: "no-unsafe-first",
  create: (context, unused: typeof defaultOptions) => {
    const invalidOperatorsRegExp = /^(take|first)$/;

    const [config = {}] = context.options;
    const { observable = defaultObservable } = config;
    const observableRegExp = new RegExp(observable);

    const { couldBeObservable } = getTypeServices(context);

    function checkNode(node: es.CallExpression) {
      if (!node.arguments || !couldBeObservable(node)) {
        return;
      }

      node.arguments.forEach((arg) => {
        if (isCallExpression(arg) && isIdentifier(arg.callee)) {
          if (invalidOperatorsRegExp.test(arg.callee.name)) {
            context.report({
              messageId: "forbidden",
              node: arg.callee,
            });
          }
        }
      });
    }

    return {
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]`]: checkNode,
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]`]: checkNode,
    };
  },
});

export = rule;
