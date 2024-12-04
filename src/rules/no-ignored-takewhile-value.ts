import { TSESTree as es } from '@typescript-eslint/utils';
import {
  isArrayPattern,
  isIdentifier,
  isImport,
  isObjectPattern,
} from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredTakewhileValueRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow ignoring the value within `takeWhile`.',
      recommended: 'recommended',
    },
    messages: {
      forbidden: 'Ignoring the value within takeWhile is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-takewhile-value',
  create: (context) => {
    function checkNode(
      expression: es.ArrowFunctionExpression | es.FunctionExpression,
    ) {
      const scope = context.sourceCode.getScope(expression);
      if (!isImport(scope, 'takeWhile', /^rxjs\/?/)) {
        return;
      }
      let ignored = true;
      const [param] = expression.params;
      if (param) {
        if (isIdentifier(param)) {
          const variable = scope.variables.find(
            ({ name }) => name === param.name,
          );
          if (variable && variable.references.length > 0) {
            ignored = false;
          }
        } else if (isArrayPattern(param)) {
          ignored = false;
        } else if (isObjectPattern(param)) {
          ignored = false;
        }
      }
      if (ignored) {
        context.report({
          messageId: 'forbidden',
          node: expression,
        });
      }
    }

    return {
      'CallExpression[callee.name=\'takeWhile\'] > ArrowFunctionExpression': (
        node: es.ArrowFunctionExpression,
      ) => { checkNode(node); },
      'CallExpression[callee.name=\'takeWhile\'] > FunctionExpression': (
        node: es.FunctionExpression,
      ) => { checkNode(node); },
    };
  },
});
