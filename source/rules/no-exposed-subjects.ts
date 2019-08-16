/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { typecheck } from "../utils";

const defaultAllowedTypesRegExp = /^EventEmitter$/;

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows exposed subjects.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Subject '{{subject}}' must be private.",
      forbiddenAllowProtected:
        "Subject '{{subject}}' must be private or protected."
    },
    schema: [
      {
        properties: {
          allowProtected: { type: "boolean" }
        },
        type: "object"
      }
    ]
  },
  create: context => {
    const [config] = context.options;
    const { allowProtected = false } = config || {};
    const { couldBeSubject, couldBeType } = typecheck(context);

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
      [`ClassProperty[accessibility!=${accessibilityRexExp}]`]: (
        node: es.Node // there is no `es.ClassProperty` type
      ) => {
        if (isSubject(node)) {
          const key = (node as any).key as es.Identifier;
          context.report({
            messageId,
            node: key,
            data: {
              subject: key.name
            }
          });
        }
      },
      [`MethodDefinition[kind='constructor'] > FunctionExpression > TSParameterProperty[accessibility!=${accessibilityRexExp}] > Identifier`]: (
        node: es.Identifier
      ) => {
        if (isSubject(node)) {
          context.report({
            messageId,
            loc: {
              start: node.loc.start,
              end: {
                line: node.loc.start.line,
                column: node.loc.start.column + node.name.length
              }
            },
            data: {
              subject: node.name
            }
          });
        }
      },
      [`MethodDefinition[accessibility!=${accessibilityRexExp}][kind=/^(get|set)$/]`]: (
        node: es.MethodDefinition
      ) => {
        if (isSubject(node)) {
          const key = node.key as es.Identifier;
          context.report({
            messageId,
            node: key,
            data: {
              subject: key.name
            }
          });
        }
      },
      [`MethodDefinition[accessibility!=${accessibilityRexExp}][kind='method']`]: (
        node: es.MethodDefinition
      ) => {
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
              subject: key.name
            }
          });
        }
      }
    };
  }
};

export = rule;
