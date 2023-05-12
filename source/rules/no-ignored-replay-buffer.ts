/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import {
  AST_NODE_TYPES,
  TSESTree as es,
} from "@typescript-eslint/experimental-utils";
import { getParent } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Forbids using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.",
      recommended: "error",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Ignoring the buffer size is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-ignored-replay-buffer",
  create: (context) => {
    function checkNode(
      node: es.Node,
      { arguments: args }: { arguments: es.Node[] }
    ) {
      if (!args || args.length === 0) {
        context.report({
          messageId: "forbidden",
          node,
        });
      }
    }

    return {
      "NewExpression > Identifier[name='ReplaySubject']": (
        node: es.Identifier
      ) => {
        const newExpression = getParent(node) as es.NewExpression;
        checkNode(node, newExpression);
      },
      "NewExpression > MemberExpression > Identifier[name='ReplaySubject']": (
        node: es.Identifier
      ) => {
        const memberExpression = getParent(node) as es.MemberExpression;
        const newExpression = getParent(memberExpression) as es.NewExpression;
        checkNode(node, newExpression);
      },
      "CallExpression > Identifier[name=/^(publishReplay|shareReplay)$/]": (
        node: es.Identifier
      ) => {
        const callExpression = getParent(node) as es.CallExpression;
        checkNode(node, callExpression);

        const shareReplayConfig = callExpression.arguments[0];

        if (shareReplayConfig?.type === AST_NODE_TYPES.ObjectExpression) {
          const bufferSizeProp = shareReplayConfig.properties.find(
            (p) =>
              p.type === AST_NODE_TYPES.Property &&
              p.key.type === AST_NODE_TYPES.Identifier &&
              p.key.name === "bufferSize"
          );

          if (!bufferSizeProp) {
            context.report({
              messageId: "forbidden",
              node,
            });
          }
        }
      },
    };
  },
});

export = rule;
