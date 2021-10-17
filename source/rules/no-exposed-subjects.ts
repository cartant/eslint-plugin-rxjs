/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getTypeServices, isIdentifier } from "eslint-etc";
import { ruleCreator } from "../utils";

const defaultAllowedTypesRegExp = /^EventEmitter$/;
const defaultOptions: readonly {
  allowProtected?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: "Forbids exposed (i.e. non-private) subjects.",
      recommended: false,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Subject '{{subject}}' must be private.",
      forbiddenAllowProtected:
        "Subject '{{subject}}' must be private or protected.",
    },
    schema: [
      {
        properties: {
          allowProtected: { type: "boolean" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-exposed-subjects",
  create: (context, unused: typeof defaultOptions) => {
    const [config = {}] = context.options;
    const { allowProtected = false } = config;
    const { couldBeSubject, couldBeType } = getTypeServices(context);

    const messageId = allowProtected ? "forbiddenAllowProtected" : "forbidden";
    const accessibilityRexExp = allowProtected
      ? /^(private|protected)$/
      : /^private$/;

    function isSubject(node: es.Node) {
      return (
        couldBeSubject(node) && !couldBeType(node, defaultAllowedTypesRegExp)
      );
    }

    return {
      [`PropertyDefinition[accessibility!=${accessibilityRexExp}]`]: (
        node: es.PropertyDefinition
      ) => {
        if (isSubject(node)) {
          const { key } = node;
          if (isIdentifier(key)) {
            context.report({
              messageId,
              node: key,
              data: {
                subject: key.name,
              },
            });
          }
        }
      },
      [`MethodDefinition[kind='constructor'] > FunctionExpression > TSParameterProperty[accessibility!=${accessibilityRexExp}] > Identifier`]:
        (node: es.Identifier) => {
          if (isSubject(node)) {
            const { loc } = node;
            context.report({
              messageId,
              loc: {
                ...loc,
                end: {
                  ...loc.start,
                  column: loc.start.column + node.name.length,
                },
              },
              data: {
                subject: node.name,
              },
            });
          }
        },
      [`MethodDefinition[accessibility!=${accessibilityRexExp}][kind=/^(get|set)$/]`]:
        (node: es.MethodDefinition) => {
          if (isSubject(node)) {
            const key = node.key as es.Identifier;
            context.report({
              messageId,
              node: key,
              data: {
                subject: key.name,
              },
            });
          }
        },
      [`MethodDefinition[accessibility!=${accessibilityRexExp}][kind='method']`]:
        (node: es.MethodDefinition) => {
          const functionExpression = node.value as any;
          const returnType = functionExpression.returnType;
          if (!returnType) {
            return;
          }

          const typeAnnotation = returnType.typeAnnotation;
          if (!typeAnnotation) {
            return;
          }

          if (isSubject(typeAnnotation)) {
            const key = node.key as es.Identifier;
            context.report({
              messageId,
              node: key,
              data: {
                subject: key.name,
              },
            });
          }
        },
    };
  },
});

export = rule;
