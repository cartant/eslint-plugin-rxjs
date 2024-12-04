import { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

export const noCompatRule = ruleCreator({
  defaultOptions: [],
  meta: {
    deprecated: true,
    docs: {
      description:
        'Disallow the `rxjs-compat` package.',
    },
    messages: {
      forbidden: '\'rxjs-compat\'-dependent import locations are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-compat',
  create: (context) => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs\u002f/]:not(Literal[value=/^rxjs\u002f(ajax|fetch|operators|testing|webSocket)/])`]:
        (node: es.Literal) => {
          context.report({
            messageId: 'forbidden',
            node,
          });
        },
    };
  },
});
