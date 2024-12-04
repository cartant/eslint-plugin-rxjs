import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noSubjectUnsubscribeRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow calling the `unsubscribe` method of subjects.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Calling unsubscribe on a subject is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subject-unsubscribe',
  create: (context) => {
    const { couldBeSubject, couldBeSubscription } = getTypeServices(context);

    return {
      'MemberExpression[property.name=\'unsubscribe\']': (
        node: es.MemberExpression,
      ) => {
        if (couldBeSubject(node.object)) {
          context.report({
            messageId: 'forbidden',
            node: node.property,
          });
        }
      },
      'CallExpression[callee.property.name=\'add\'][arguments.length > 0]': (
        node: es.CallExpression,
      ) => {
        const memberExpression = node.callee as es.MemberExpression;
        if (couldBeSubscription(memberExpression.object)) {
          const [arg] = node.arguments;
          if (couldBeSubject(arg)) {
            context.report({
              messageId: 'forbidden',
              node: arg,
            });
          }
        }
      },
    };
  },
});
