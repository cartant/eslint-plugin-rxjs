import { AST_NODE_TYPES, TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noSubscribeInPipeRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow calling of `subscribe` within any RxJS operator inside a `pipe`.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: 'Subscribe calls within pipe operators are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subscribe-in-pipe',
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    function isWithinPipe(node: es.Node): boolean {
      let parent = node.parent;

      while (parent) {
        if (
          parent.type === AST_NODE_TYPES.CallExpression
          && parent.callee.type === AST_NODE_TYPES.MemberExpression
          && parent.callee.property.type === AST_NODE_TYPES.Identifier
          && parent.callee.property.name === 'pipe'
        ) {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    }

    return {
      'CallExpression > MemberExpression[property.name=\'subscribe\']': (
        node: es.MemberExpression,
      ) => {
        if (
          !couldBeObservable(node.object)
          && !couldBeType(node.object, 'Subscribable')
        ) {
          return;
        }

        if (isWithinPipe(node)) {
          context.report({
            messageId: 'forbidden',
            node: node.property,
          });
        }
      },
    };
  },
});
