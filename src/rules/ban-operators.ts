import { TSESTree as es } from '@typescript-eslint/utils';
import { stripIndent } from 'common-tags';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

const defaultOptions: readonly Record<string, boolean | string>[] = [];

export const banOperatorsRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow banned operators.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'RxJS operator is banned: {{name}}{{explanation}}.',
    },
    schema: [
      {
        type: 'object',
        description: stripIndent`
          An object containing keys that are names of operators
          and values that are either booleans or strings containing the explanation for the ban.`,
      },
    ],
    type: 'problem',
  },
  name: 'ban-operators',
  create: (context) => {
    const { couldBeType } = getTypeServices(context);
    const bans: { name: string; explanation: string }[] = [];

    const [config] = context.options;
    if (!config) {
      return {};
    }

    Object.entries(config).forEach(([key, value]) => {
      if (value !== false) {
        bans.push({
          name: key,
          explanation: typeof value === 'string' ? value : '',
        });
      }
    });

    function checkNode(node: es.Node) {
      for (const ban of bans) {
        if (couldBeType(node, ban.name, { name: /[/\\]rxjs[/\\]/ })) {
          const explanation = ban.explanation ? `: ${ban.explanation}` : '';
          context.report({
            messageId: 'forbidden',
            data: { name: ban.name, explanation },
            node,
          });
          return;
        }
      }
    }

    return {
      'CallExpression[callee.property.name=\'pipe\'] > CallExpression[callee.name]': (node: es.CallExpression) => {
        checkNode(node.callee);
      },
      'CallExpression[callee.property.name=\'pipe\'] > CallExpression[callee.type="MemberExpression"]': (node: es.CallExpression) => {
        const callee = node.callee as es.MemberExpression;
        checkNode(callee.property);
      },
    };
  },
});
