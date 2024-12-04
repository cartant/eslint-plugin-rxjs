import { AST_NODE_TYPES, TSESTree as es } from '@typescript-eslint/utils';
import { stripIndent } from 'common-tags';
import { ruleCreator } from '../utils';

const defaultOptions: readonly Record<string, boolean | string>[] = [];

export const banObservablesRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow banned observable creators.',
    },
    messages: {
      forbidden: 'RxJS observable is banned: {{name}}{{explanation}}.',
    },
    schema: [
      {
        type: 'object',
        description: stripIndent`
          An object containing keys that are names of observable factory functions
          and values that are either booleans or strings containing the explanation for the ban.`,
      },
    ],
    type: 'problem',
  },
  name: 'ban-observables',
  create: (context) => {
    const bans: { explanation: string; regExp: RegExp }[] = [];

    const [config] = context.options;
    if (!config) {
      return {};
    }

    Object.entries(config).forEach(([key, value]) => {
      if (value !== false) {
        bans.push({
          explanation: typeof value === 'string' ? value : '',
          regExp: new RegExp(`^${key}$`),
        });
      }
    });

    function getFailure(name: string) {
      for (let b = 0, length = bans.length; b < length; ++b) {
        const ban = bans[b];
        if (ban.regExp.test(name)) {
          const explanation = ban.explanation ? `: ${ban.explanation}` : '';
          return {
            messageId: 'forbidden',
            data: { name, explanation },
          } as const;
        }
      }
      return undefined;
    }

    return {
      'ImportDeclaration[source.value=\'rxjs\'] > ImportSpecifier': (
        node: es.ImportSpecifier,
      ) => {
        const identifier = node.imported;
        const name = identifier.type === AST_NODE_TYPES.Identifier ? identifier.name : identifier.value;
        const failure = getFailure(name);
        if (failure) {
          context.report({
            ...failure,
            node: identifier,
          });
        }
      },
    };
  },
});
