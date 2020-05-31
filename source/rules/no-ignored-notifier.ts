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
        "Forbids observables not composed from the `repeatWhen` or `retryWhen` notifier.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Ignoring the notifier is forbidden.",
    },
    schema: [],
  },
  create: (context) => {
    const { couldBeMonoTypeOperatorFunction } = typecheck(context);

    type Entry = {
      node: es.Node;
      param: es.Identifier;
      sightings: number;
    };
    const entries: Entry[] = [];

    function getEntry() {
      const { length, [length - 1]: entry } = entries;
      return entry;
    }

    return {
      "CallExpression[callee.name=/^(repeatWhen|retryWhen)$/]": (
        node: es.CallExpression
      ) => {
        if (couldBeMonoTypeOperatorFunction(node)) {
          const [arg] = node.arguments;
          if (isArrowFunctionExpression(arg) || isFunctionExpression(arg)) {
            const [param] = arg.params as es.Identifier[];
            if (param) {
              entries.push({
                node,
                param,
                sightings: 0,
              });
            } else {
              context.report({
                messageId: "forbidden",
                node: node.callee,
              });
            }
          }
        }
      },
      "CallExpression[callee.name=/^(repeatWhen|retryWhen)$/]:exit": (
        node: es.CallExpression
      ) => {
        const entry = getEntry();
        if (!entry) {
          return;
        }
        if (entry.node === node) {
          if (entry.sightings < 2) {
            context.report({
              messageId: "forbidden",
              node: node.callee,
            });
          }
          entries.pop();
        }
      },
      Identifier: (node: es.Identifier) => {
        const entry = getEntry();
        if (!entry) {
          return;
        }
        if (node.name === entry.param.name) {
          ++entry.sightings;
        }
      },
    };
  },
};

export = rule;
