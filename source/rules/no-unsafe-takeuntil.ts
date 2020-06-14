/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { stripIndent } from "common-tags";
import {
  getParent,
  getTypeServices,
  isCallExpression,
  isIdentifier,
} from "eslint-etc";
import { ruleCreator } from "../utils";

const defaultOptions: {
  alias?: string[];
  allow?: string[];
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids the application of operators after `takeUntil`.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Applying operators after takeUntil are forbidden.",
    },
    schema: [
      {
        properties: {
          alias: { type: "array", items: { type: "string" } },
          allow: { type: "array", items: { type: "string" } },
        },
        type: "object",
        description: stripIndent`
          An optional object with optional \`alias\` and \`allow\` properties.
          The \`alias\` property is an array containing the names of operators that aliases for \`takeUntil\`.
          The \`allow\` property is an array containing the names of the operators that are allowed to follow \`takeUntil\`.`,
      },
    ],
    type: "problem",
  },
  name: "no-unsafe-takeuntil",
  create: (context, unused: typeof defaultOptions) => {
    let checkedOperatorsRegExp = /^takeUntil$/;
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
      "toArray",
    ];
    const [config = {}] = context.options;
    const { alias, allow = allowedOperators } = config;

    if (alias) {
      checkedOperatorsRegExp = new RegExp(
        `^(${alias.concat("takeUntil").join("|")})$`
      );
    }

    const { couldBeObservable, isReferenceType } = getTypeServices(context);

    return {
      [`CallExpression[callee.property.name='pipe'] > CallExpression[callee.name=${checkedOperatorsRegExp}]`]: (
        node: es.CallExpression
      ) => {
        const pipeCallExpression = getParent(node) as es.CallExpression;
        if (
          !pipeCallExpression.arguments ||
          !isReferenceType(pipeCallExpression) ||
          !couldBeObservable(pipeCallExpression)
        ) {
          return;
        }

        pipeCallExpression.arguments.reduceRight((isError, arg) => {
          if (!isCallExpression(arg) || !isIdentifier(arg.callee)) {
            return true;
          }

          if (isError && checkedOperatorsRegExp.test(arg.callee.name)) {
            context.report({
              messageId: "forbidden",
              node: arg.callee,
            });
          }

          return isError || !allow.includes(arg.callee.name);
        }, false);
      },
    };
  },
});

export = rule;
