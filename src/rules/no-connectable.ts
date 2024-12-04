import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noConnectableRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow operators that return connectable observables.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Connectable observables are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-connectable',
  create: (context) => {
    const { couldBeFunction } = getTypeServices(context);
    return {
      'CallExpression[callee.name=\'multicast\']': (node: es.CallExpression) => {
        if (node.arguments.length === 1) {
          context.report({
            messageId: 'forbidden',
            node: node.callee,
          });
        }
      },
      'CallExpression[callee.name=/^(publish|publishBehavior|publishLast|publishReplay)$/]':
        (node: es.CallExpression) => {
          if (!node.arguments.some((arg) => couldBeFunction(arg))) {
            context.report({
              messageId: 'forbidden',
              node: node.callee,
            });
          }
        },
    };
  },
});
