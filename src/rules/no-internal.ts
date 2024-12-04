import {
  TSESTree as es,
  TSESLint as eslint,
} from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

export const noInternalRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow importing internal modules.',
      recommended: 'recommended',
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      forbidden: 'RxJS imports from internal are forbidden.',
      suggest: 'Import from a non-internal location.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-internal',
  create: (context) => {
    function getReplacement(location: string) {
      const match = /^\s*('|")/.exec(location);
      if (!match) {
        return undefined;
      }
      const [, quote] = match;
      if (/^['"]rxjs\/internal\/ajax/.test(location)) {
        return `${quote}rxjs/ajax${quote}`;
      }
      if (/^['"]rxjs\/internal\/observable\/dom\/fetch/.test(location)) {
        return `${quote}rxjs/fetch${quote}`;
      }
      if (/^['"]rxjs\/internal\/observable\/dom\/webSocket/i.test(location)) {
        return `${quote}rxjs/webSocket${quote}`;
      }
      if (/^['"]rxjs\/internal\/observable/.test(location)) {
        return `${quote}rxjs${quote}`;
      }
      if (/^['"]rxjs\/internal\/operators/.test(location)) {
        return `${quote}rxjs/operators${quote}`;
      }
      if (/^['"]rxjs\/internal\/scheduled/.test(location)) {
        return `${quote}rxjs${quote}`;
      }
      if (/^['"]rxjs\/internal\/scheduler/.test(location)) {
        return `${quote}rxjs${quote}`;
      }
      if (/^['"]rxjs\/internal\/testing/.test(location)) {
        return `${quote}rxjs/testing${quote}`;
      }
      return undefined;
    }

    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs\u002finternal/]`]: (
        node: es.Literal,
      ) => {
        const replacement = getReplacement(node.raw);
        if (replacement) {
          function fix(fixer: eslint.RuleFixer) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return fixer.replaceText(node, replacement!);
          }
          context.report({
            fix,
            messageId: 'forbidden',
            node,
            suggest: [{ fix, messageId: 'suggest' }],
          });
        } else {
          context.report({
            messageId: 'forbidden',
            node,
          });
        }
      },
    };
  },
});
