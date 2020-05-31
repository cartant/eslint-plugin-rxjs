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

    type Record = {
      node: es.Node;
      param: es.Identifier;
      sightings: number;
    };
    const records: Record[] = [];

    function getRecord() {
      const { length, [length - 1]: record } = records;
      return record;
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
              records.push({
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
        const record = getRecord();
        if (!record) {
          return;
        }
        if (record.node === node) {
          if (record.sightings < 2) {
            context.report({
              messageId: "forbidden",
              node: node.callee,
            });
          }
          records.pop();
        }
      },
      Identifier: (node: es.Identifier) => {
        const record = getRecord();
        if (!record) {
          return;
        }
        if (node.name === record.param.name) {
          ++record.sightings;
        }
      },
    };
  },
};

export = rule;
