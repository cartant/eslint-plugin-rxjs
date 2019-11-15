/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule, SourceCode } from "eslint";
import * as es from "estree";
import {
  getParent,
  isBlockStatement,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isProgram,
  typecheck
} from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Forbids redundant notifications from completed or errored observables.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Redundant notifications are forbidden."
    },
    schema: []
  },
  create: context => {
    const sourceCode = context.getSourceCode();
    const { couldBeType } = typecheck(context);
    return {
      "ExpressionStatement[expression.callee.property.name=/^(complete|error)$/] ~ ExpressionStatement[expression.callee.property.name=/^(next|complete|error)$/]": (
        node: es.ExpressionStatement
      ) => {
        const parent = getParent(node);
        if (!isBlockStatement(parent) && !isProgram(parent)) {
          return;
        }
        const { body } = parent;
        const index = body.indexOf(node);
        const sibling = body[index - 1] as es.ExpressionStatement;
        if (
          getExpressionText(sibling, sourceCode) !==
          getExpressionText(node, sourceCode)
        ) {
          return;
        }
        if (
          !isExpressionObserver(sibling, couldBeType) ||
          !isExpressionObserver(node, couldBeType)
        ) {
          return;
        }
        const { expression } = node;
        if (isCallExpression(expression)) {
          const { callee } = expression;
          if (isMemberExpression(callee)) {
            const { property } = callee;
            if (isIdentifier(property)) {
              context.report({
                messageId: "forbidden",
                node: property
              });
            }
          }
        }
      }
    };
  }
};

function getExpressionText(
  expressionStatement: es.ExpressionStatement,
  sourceCode: SourceCode
): string | undefined {
  if (!isCallExpression(expressionStatement.expression)) {
    return undefined;
  }
  const callExpression = expressionStatement.expression;
  if (!isMemberExpression(callExpression.callee)) {
    return undefined;
  }
  const { object } = callExpression.callee;
  return sourceCode.getText(object);
}

function isExpressionObserver(
  expressionStatement: es.ExpressionStatement,
  couldBeType: (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp }
  ) => boolean
): boolean {
  if (!isCallExpression(expressionStatement.expression)) {
    return false;
  }
  const callExpression = expressionStatement.expression;
  if (!isMemberExpression(callExpression.callee)) {
    return false;
  }
  const { object } = callExpression.callee;
  return couldBeType(object, /^(Subject|Subscriber)$/);
}

export = rule;
