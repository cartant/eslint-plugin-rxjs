/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { isCallExpression, isIdentifier, typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows the application of operators after takeUntil.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Applying operators after `takeUntil` are forbidden."
    },
    schema: [
      {
        properties: {
          allow: { type: "array", items: { type: "string" } }
        },
        type: "object"
      }
    ]
  },
  create: context => {
    const allowedOperators = [
      "count",
      "defaultIfEmpty",
      "endWith",
      "every",
      "finalize",
      "finally",
      "isEmpty",
      "last",
      "max",
      "min",
      "publish",
      "publishBehavior",
      "publishLast",
      "publishReplay",
      "reduce",
      "share",
      "shareReplay",
      "skipLast",
      "takeLast",
      "throwIfEmpty",
      "toArray"
    ];
    const [config] = context.options;
    const { allow = allowedOperators } = config || {};

    const { couldBeObservable, isReferenceType } = typecheck(context);

    return {
      "CallExpression[callee.property.name='pipe'][arguments]:has(CallExpression[callee.name='takeUntil'])": (
        node: es.CallExpression
      ) => {
        if (!isReferenceType(node) || !couldBeObservable(node)) {
          return;
        }

        node.arguments.reduceRight((isError, arg) => {
          if (!isCallExpression(arg)) {
            return true;
          }

          if (!isIdentifier(arg.callee)) {
            return isError;
          }

          const name = arg.callee.name;
          if (isError && name === "takeUntil") {
            context.report({
              messageId: "forbidden",
              node: arg.callee
            });
          }

          return isError || !allow.includes(arg.callee.name);
        }, false);
      }
    };
  }
};

export = rule;
