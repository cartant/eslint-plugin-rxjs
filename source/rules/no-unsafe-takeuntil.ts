/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
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
        type: "object",
        description: stripIndent`
          An optional object with an optional \`allow\` property.
          The property is an array containing the names of the operators that are allowed to follow \`takeUntil\`.`
      }
    ]
  },
  create: context => {
    const invalidOperatorsRegExp = /^takeUntil$/;
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
      [`CallExpression[callee.property.name='pipe'][arguments]:has(CallExpression[callee.name=${invalidOperatorsRegExp}])`]: (
        node: es.CallExpression
      ) => {
        if (
          !node.arguments ||
          !isReferenceType(node) ||
          !couldBeObservable(node)
        ) {
          return;
        }

        node.arguments.reduceRight((isError, arg) => {
          if (!isCallExpression(arg) || !isIdentifier(arg.callee)) {
            return true;
          }

          if (isError && invalidOperatorsRegExp.test(arg.callee.name)) {
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
