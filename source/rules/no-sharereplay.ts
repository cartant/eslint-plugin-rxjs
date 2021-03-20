/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { ruleCreator } from "../utils";

const defaultOptions: readonly {
  allowConfig?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids using the `shareReplay` operator.",
      recommended: "error",
    },
    fixable: undefined,
    messages: {
      forbidden: "shareReplay is forbidden.",
      forbiddenWithoutConfig:
        "shareReplay is forbidden unless a config argument is passed.",
    },
    schema: [
      {
        properties: {
          allowConfig: { type: "boolean" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-sharereplay",
  create: (context, unused: typeof defaultOptions) => {
    const [config = {}] = context.options;
    const { allowConfig = true } = config;
    return {
      "CallExpression[callee.name='shareReplay']": (
        node: es.CallExpression
      ) => {
        let report = true;
        if (allowConfig) {
          report =
            node.arguments.length !== 1 ||
            node.arguments[0].type !== "ObjectExpression";
        }
        if (report) {
          context.report({
            messageId: allowConfig ? "forbiddenWithoutConfig" : "forbidden",
            node: node.callee,
          });
        }
      },
    };
  },
});

export = rule;
