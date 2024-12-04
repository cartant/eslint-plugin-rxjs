import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices, isCallExpression, isChainExpression, isUnaryExpression } from '../etc';
import { ruleCreator } from '../utils';

const defaultOptions: readonly {
  ignoreVoid?: boolean;
}[] = [];

const messageBase
  = 'Observables must be subscribed to, returned, converted to a promise and awaited, '
  + 'or be explicitly marked as ignored with the `void` operator.';

const messageBaseNoVoid
    = 'Observables must be subscribed to, returned, or converted to a promise and awaited.';

export const noFloatingObservablesRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Require Observables to be handled appropriately.',
      recommended: 'strict',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: messageBase,
      forbiddenNoVoid: messageBaseNoVoid,
    },
    schema: [
      {
        properties: {
          ignoreVoid: { type: 'boolean', default: true, description: 'Whether to ignore `void` expressions.' },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'no-floating-observables',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);
    const [config = {}] = context.options;
    const { ignoreVoid = true } = config;

    function checkNode(node: es.CallExpression) {
      if (couldBeObservable(node)) {
        context.report({
          messageId: ignoreVoid ? 'forbidden' : 'forbiddenNoVoid',
          node,
        });
      }
    }

    function checkVoid(node: es.UnaryExpression) {
      if (ignoreVoid) return;
      if (node.operator !== 'void') return;

      let expression = node.argument;
      if (isChainExpression(expression)) {
        expression = expression.expression;
      }

      if (!isCallExpression(expression)) return;
      checkNode(expression);
    }

    return {
      'ExpressionStatement > CallExpression': (node: es.CallExpression) => {
        checkNode(node);
      },
      'ExpressionStatement > UnaryExpression': (node: es.UnaryExpression) => {
        checkVoid(node);
      },
      'ExpressionStatement > ChainExpression': (node: es.ChainExpression) => {
        if (!isCallExpression(node.expression)) return;

        checkNode(node.expression);
      },
      'ExpressionStatement > SequenceExpression': (node: es.SequenceExpression) => {
        node.expressions.forEach(expression => {
          if (isCallExpression(expression)) {
            checkNode(expression);
          }
        });
      },
      'ExpressionStatement > ArrayExpression': (node: es.ArrayExpression) => {
        node.elements.forEach(expression => {
          if (!expression) return;
          if (isCallExpression(expression)) {
            checkNode(expression);
          } else if (isUnaryExpression(expression)) {
            checkVoid(expression);
          }
        });
      },
    };
  },
});
