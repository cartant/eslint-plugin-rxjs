/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Forbids using the `shareReplay` operator.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "shareReplay is forbidden.",
      forbiddenWithoutConfig:
        "shareReplay is forbidden unless a config argument is passed."
    },
    schema: [
      {
        properties: {
          allowConfig: { type: "boolean" }
        },
        type: "object"
      }
    ]
  },
  create: context => {
    const [config] = context.options;
    const { allowConfig = false } = config || {};
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
            node: node.callee
          });
        }
      }
    };
  }
};

export = rule;
