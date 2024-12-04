import { TSESTree as es } from '@typescript-eslint/utils';
import {
  getTypeServices,
  isArrowFunctionExpression,
  isFunctionExpression,
} from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredNotifierRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow observables not composed from the `repeatWhen` or `retryWhen` notifier.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Ignoring the notifier is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-notifier',
  create: (context) => {
    const { couldBeMonoTypeOperatorFunction } = getTypeServices(context);

    interface Entry {
      node: es.Node;
      param: es.Identifier;
      sightings: number;
    }
    const entries: Entry[] = [];

    function getEntry() {
      const { length, [length - 1]: entry } = entries;
      return entry;
    }

    return {
      'CallExpression[callee.name=/^(repeatWhen|retryWhen)$/]': (
        node: es.CallExpression,
      ) => {
        if (couldBeMonoTypeOperatorFunction(node)) {
          const [arg] = node.arguments;
          if (isArrowFunctionExpression(arg) || isFunctionExpression(arg)) {
            const [param] = arg.params as es.Identifier[];
            if (param) {
              entries.push({
                node,
                param,
                sightings: 0,
              });
            } else {
              context.report({
                messageId: 'forbidden',
                node: node.callee,
              });
            }
          }
        }
      },
      'CallExpression[callee.name=/^(repeatWhen|retryWhen)$/]:exit': (
        node: es.CallExpression,
      ) => {
        const entry = getEntry();
        if (!entry) {
          return;
        }
        if (entry.node === node) {
          if (entry.sightings < 2) {
            context.report({
              messageId: 'forbidden',
              node: node.callee,
            });
          }
          entries.pop();
        }
      },
      'Identifier': (node: es.Identifier) => {
        const entry = getEntry();
        if (!entry) {
          return;
        }
        if (node.name === entry.param.name) {
          ++entry.sightings;
        }
      },
    };
  },
});
