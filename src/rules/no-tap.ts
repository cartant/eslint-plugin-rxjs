import { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

export const noTapRule = ruleCreator({
  defaultOptions: [],
  meta: {
    deprecated: true,
    docs: {
      description: 'Disallow the `tap` operator.',
    },
    messages: {
      forbidden: 'The tap operator is forbidden.',
    },
    replacedBy: ['ban-operators'],
    schema: [],
    type: 'problem',
  },
  name: 'no-tap',
  create: (context) => {
    return {
      [String.raw`ImportDeclaration[source.value=/^rxjs(\u002foperators)?$/] > ImportSpecifier[imported.name='tap']`]:
        (node: es.ImportSpecifier) => {
          const { loc } = node;
          context.report({
            messageId: 'forbidden',
            loc: {
              ...loc,
              end: {
                ...loc.start,
                column: loc.start.column + 3,
              },
            },
          });
        },
    };
  },
});
