import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noNestedSubscribeRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow calling `subscribe` within a `subscribe` callback.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Nested subscribe calls are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-nested-subscribe',
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);
    const argumentsMap = new WeakMap<es.Node, void>();
    return {
      [`CallExpression > MemberExpression[property.name='subscribe']`]: (
        node: es.MemberExpression,
      ) => {
        if (
          !couldBeObservable(node.object)
          && !couldBeType(node.object, 'Subscribable')
        ) {
          return;
        }
        const callExpression = node.parent as es.CallExpression;
        let parent = callExpression.parent as es.Node | undefined;
        while (parent) {
          if (argumentsMap.has(parent)) {
            context.report({
              messageId: 'forbidden',
              node: node.property,
            });
            return;
          }
          parent = parent.parent;
        }
        for (const arg of callExpression.arguments) {
          argumentsMap.set(arg);
        }
      },
    };
  },
});
