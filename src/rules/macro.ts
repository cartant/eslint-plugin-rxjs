import {
  TSESTree as es,
  TSESLint as eslint,
} from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

export const macroRule = ruleCreator({
  defaultOptions: [],
  meta: {
    deprecated: true,
    docs: {
      description: 'Require the use of the RxJS Tools Babel macro.',
    },
    fixable: 'code',
    messages: {
      macro: 'Use the RxJS Tools Babel macro.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'macro',
  create: (context) => {
    let hasFailure = false;
    let hasMacroImport = false;
    let program: es.Program | undefined = undefined;

    function fix(fixer: eslint.RuleFixer) {
      return fixer.insertTextBefore(
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        program!,
        `import "babel-plugin-rxjs-tools/macro";\n`,
      );
    }

    return {
      'CallExpression[callee.property.name=/^(pipe|subscribe)$/]': (
        node: es.CallExpression,
      ) => {
        if (hasFailure || hasMacroImport) {
          return;
        }
        hasFailure = true;
        context.report({
          fix,
          messageId: 'macro',
          node: node.callee,
        });
      },
      'ImportDeclaration[source.value=\'babel-plugin-rxjs-tools/macro\']': (
        _node: es.ImportDeclaration,
      ) => {
        hasMacroImport = true;
      },
      [String.raw`ImportDeclaration[source.value=/^rxjs(\u002f|$)/]`]: (
        node: es.ImportDeclaration,
      ) => {
        if (hasFailure || hasMacroImport) {
          return;
        }
        hasFailure = true;
        context.report({
          fix,
          messageId: 'macro',
          node,
        });
      },
      'Program': (node: es.Program) => {
        program = node;
      },
    };
  },
});
