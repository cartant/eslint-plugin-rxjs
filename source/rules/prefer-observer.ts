/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import {
  isArrowFunctionExpression,
  isFunctionExpression,
  typecheck,
} from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Forbids the passing separate callbacks to `subscribe` and `tap`.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden:
        "Passing separate callbacks is forbidden; pass an observer instead.",
    },
    schema: [
      {
        properties: {
          allowNext: { type: "boolean" },
        },
        type: "object",
      },
    ],
  },
  create: (context) => {
    const { couldBeFunction } = typecheck(context);
    const [config = {}] = context.options;
    const { allowNext = true } = config;

    function checkArgs(callExpression: es.CallExpression, reportNode: es.Node) {
      const { arguments: args } = callExpression;
      if (args.length > 1) {
        context.report({
          messageId: "forbidden",
          node: reportNode,
        });
      } else if (args.length === 1 && !allowNext) {
        const [arg] = args;
        if (
          isArrowFunctionExpression(arg) ||
          isFunctionExpression(arg) ||
          couldBeFunction(arg)
        ) {
          context.report({
            messageId: "forbidden",
            node: reportNode,
          });
        }
      }
    }

    return {
      "CallExpression[callee.property.name='pipe'] > CallExpression[callee.name='tap']": (
        node: es.CallExpression
      ) => checkArgs(node, node.callee),
      "CallExpression[callee.property.name='subscribe']": (
        node: es.CallExpression
      ) => checkArgs(node, (node.callee as es.MemberExpression).property),
    };
  },
};

export = rule;
