import { AST_NODE_TYPES, TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

const defaultOptions: readonly {
  allowConfig?: boolean;
}[] = [];

export const noSharereplayRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow unsafe `shareReplay` usage.',
      recommended: 'recommended',
    },
    messages: {
      forbidden: 'shareReplay is forbidden.',
      forbiddenWithoutConfig:
        'shareReplay is forbidden unless a config argument is passed.',
    },
    schema: [
      {
        properties: {
          allowConfig: { type: 'boolean', description: 'Allow shareReplay if a config argument is specified.', default: true },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'no-sharereplay',
  create: (context) => {
    const [config = {}] = context.options;
    const { allowConfig = true } = config;
    return {
      'CallExpression[callee.name=\'shareReplay\']': (
        node: es.CallExpression,
      ) => {
        let report = true;
        if (allowConfig) {
          report
            = node.arguments.length !== 1
            || node.arguments[0].type !== AST_NODE_TYPES.ObjectExpression;
        }
        if (report) {
          context.report({
            messageId: allowConfig ? 'forbiddenWithoutConfig' : 'forbidden',
            node: node.callee,
          });
        }
      },
    };
  },
});
