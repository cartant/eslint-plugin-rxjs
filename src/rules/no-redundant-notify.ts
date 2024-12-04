import {
  TSESTree as es,
  TSESLint as eslint,
} from '@typescript-eslint/utils';
import {
  getTypeServices,
  isBlockStatement,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isProgram,
} from '../etc';
import { ruleCreator } from '../utils';

export const noRedundantNotifyRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow sending redundant notifications from completed or errored observables.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Redundant notifications are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-redundant-notify',
  create: (context) => {
    const sourceCode = context.sourceCode;
    const { couldBeType } = getTypeServices(context);
    return {
      'ExpressionStatement[expression.callee.property.name=/^(complete|error)$/] + ExpressionStatement[expression.callee.property.name=/^(next|complete|error)$/]':
        (node: es.ExpressionStatement) => {
          const parent = node.parent;
          if (!parent) {
            return;
          }
          if (!isBlockStatement(parent) && !isProgram(parent)) {
            return;
          }
          const { body } = parent;
          const index = body.indexOf(node);
          const sibling = body[index - 1] as es.ExpressionStatement;
          if (
            getExpressionText(sibling, sourceCode)
            !== getExpressionText(node, sourceCode)
          ) {
            return;
          }
          if (
            !isExpressionObserver(sibling, couldBeType)
            || !isExpressionObserver(node, couldBeType)
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
                  messageId: 'forbidden',
                  node: property,
                });
              }
            }
          }
        },
    };
  },
});

function getExpressionText(
  expressionStatement: es.ExpressionStatement,
  sourceCode: eslint.SourceCode,
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
  ) => boolean,
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
