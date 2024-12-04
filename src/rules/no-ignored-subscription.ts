import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredSubscriptionRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow ignoring the subscription returned by `subscribe`.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Ignoring returned subscriptions is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-subscription',
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    return {
      'ExpressionStatement > CallExpression > MemberExpression[property.name=\'subscribe\']':
        (node: es.MemberExpression) => {
          if (couldBeObservable(node.object)) {
            const callExpression = node.parent as es.CallExpression;
            if (
              callExpression.arguments.length === 1
              && couldBeType(callExpression.arguments[0], 'Subscriber')
            ) {
              return;
            }
            context.report({
              messageId: 'forbidden',
              node: node.property,
            });
          }
        },
    };
  },
});
