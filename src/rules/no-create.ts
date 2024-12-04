import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noCreateRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow the static `Observable.create` function.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Observable.create is forbidden; use new Observable.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-create',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      'CallExpression > MemberExpression[object.name=\'Observable\'] > Identifier[name=\'create\']':
        (node: es.Identifier) => {
          const memberExpression = node.parent as es.MemberExpression;
          if (couldBeObservable(memberExpression.object)) {
            context.report({
              messageId: 'forbidden',
              node,
            });
          }
        },
    };
  },
});
