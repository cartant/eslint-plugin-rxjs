import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noAsyncSubscribeRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow passing `async` functions to `subscribe`.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Passing async functions to subscribe is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-async-subscribe',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    function checkNode(
      node: es.FunctionExpression | es.ArrowFunctionExpression,
    ) {
      const parentNode = node.parent as es.CallExpression;
      const callee = parentNode.callee as es.MemberExpression;

      if (couldBeObservable(callee.object)) {
        const { loc } = node;
        // only report the `async` keyword
        const asyncLoc = {
          ...loc,
          end: {
            ...loc.start,
            column: loc.start.column + 5,
          },
        };

        context.report({
          messageId: 'forbidden',
          loc: asyncLoc,
        });
      }
    }
    return {
      'CallExpression[callee.property.name=\'subscribe\'] > FunctionExpression[async=true]':
        checkNode,
      'CallExpression[callee.property.name=\'subscribe\'] > ArrowFunctionExpression[async=true]':
        checkNode,
    };
  },
});
