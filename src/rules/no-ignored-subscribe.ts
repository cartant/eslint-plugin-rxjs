import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredSubscribeRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow calling `subscribe` without specifying arguments.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Calling subscribe without arguments is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-subscribe',
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    return {
      'CallExpression[arguments.length = 0][callee.property.name=\'subscribe\']':
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
