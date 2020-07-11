/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import {
  AST_NODE_TYPES,
  TSESLint as eslint,
  TSESTree as es,
} from "@typescript-eslint/experimental-utils";
import {
  hasTypeAnnotation,
  isArrowFunctionExpression,
  isFunctionExpression,
} from "eslint-etc";
import { ruleCreator } from "../utils";

const defaultOptions: {
  allowExplicitAny?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description:
        "Forbids implicit `any` error parameters in `catchError` operators.",
      recommended: false,
      suggestion: true,
    },
    fixable: "code",
    messages: {
      explicitAny: "Explicit `any` in `catchError`.",
      implicitAny: "Implicit `any` in `catchError`.",
      narrowed: "Error type must be `unknown` or `any`.",
      suggestExplicitUnknown:
        "Use `unknown` instead, this will force you to explicitly and safely assert the type is correct.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowExplicitAny: {
            type: "boolean",
          },
        },
        type: "object",
      },
    ],
    type: "suggestion",
  },
  name: "no-implicit-any-catch",
  create: (context, unused: typeof defaultOptions) => {
    const [config = {}] = context.options;
    const { allowExplicitAny = false } = config;
    return {
      "CallExpression[callee.name='catchError']": (node: es.CallExpression) => {
        const [arg] = node.arguments;
        if (!arg) {
          return;
        }
        if (isArrowFunctionExpression(arg) || isFunctionExpression(arg)) {
          const [param] = arg.params;
          if (hasTypeAnnotation(param)) {
            const { typeAnnotation } = param;
            const {
              typeAnnotation: { type },
            } = typeAnnotation;
            if (type === AST_NODE_TYPES.TSAnyKeyword) {
              if (allowExplicitAny) {
                return;
              }
              function fix(fixer: eslint.RuleFixer) {
                return fixer.replaceText(typeAnnotation, ": unknown");
              }
              context.report({
                fix,
                messageId: "explicitAny",
                node: param,
                suggest: [
                  {
                    messageId: "suggestExplicitUnknown",
                    fix,
                  },
                ],
              });
            } else if (type !== AST_NODE_TYPES.TSUnknownKeyword) {
              function fix(fixer: eslint.RuleFixer) {
                return fixer.replaceText(typeAnnotation, ": unknown");
              }
              context.report({
                messageId: "narrowed",
                node: param,
                suggest: [
                  {
                    messageId: "suggestExplicitUnknown",
                    fix,
                  },
                ],
              });
            }
          } else {
            function fix(fixer: eslint.RuleFixer) {
              return fixer.insertTextAfter(param, ": unknown");
            }
            context.report({
              fix,
              messageId: "implicitAny",
              node: param,
              suggest: [
                {
                  messageId: "suggestExplicitUnknown",
                  fix,
                },
              ],
            });
          }
        }
      },
    };
  },
});

export = rule;
