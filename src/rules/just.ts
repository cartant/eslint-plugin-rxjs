import { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

export const justRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Require the use of `just` instead of `of`.',
    },
    fixable: 'code',
    messages: {
      forbidden: 'Use just alias.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'just',
  create: (context) => {
    return {
      'ImportDeclaration[source.value=\'rxjs\'] > ImportSpecifier[imported.name=\'of\']':
        (node: es.ImportSpecifier) => {
          // import declaration has been renamed
          if (
            node.local.range[0] !== node.imported.range[0]
            && node.local.range[1] !== node.imported.range[1]
          ) {
            return;
          }

          context.report({
            messageId: 'forbidden',
            node,
            fix: (fixer) => fixer.replaceTextRange(node.range, 'of as just'),
          });

          const [ofImport] = context.sourceCode.getDeclaredVariables(node);
          ofImport.references.forEach((ref) => {
            context.report({
              messageId: 'forbidden',
              node: ref.identifier,
              fix: (fixer) =>
                fixer.replaceTextRange(ref.identifier.range, 'just'),
            });
          });
        },
    };
  },
});
