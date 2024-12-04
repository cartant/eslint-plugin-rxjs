import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noSubscribeHandlersRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow passing handlers to `subscribe`.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Passing handlers to subscribe is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subscribe-handlers',
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    return {
      'CallExpression[arguments.length > 0][callee.property.name=\'subscribe\']':
        (node: es.CallExpression) => {
          const callee = node.callee as es.MemberExpression;
          if (
            couldBeObservable(callee.object)
            || couldBeType(callee.object, 'Subscribable')
          ) {
            context.report({
              messageId: 'forbidden',
              node: callee.property,
            });
          }
        },
    };
  },
});
