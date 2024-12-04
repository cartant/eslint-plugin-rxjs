import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices, isIdentifier } from '../etc';
import { ruleCreator } from '../utils';

const defaultAllowedTypesRegExp = /^EventEmitter$/;
const defaultOptions: readonly {
  allowProtected?: boolean;
}[] = [];

export const noExposedSubjectsRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow public and protected subjects.',
      recommended: 'strict',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Subject \'{{subject}}\' must be private.',
      forbiddenAllowProtected:
        'Subject \'{{subject}}\' must be private or protected.',
    },
    schema: [
      {
        properties: {
          allowProtected: { type: 'boolean', description: 'Allow protected subjects.', default: false },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'no-exposed-subjects',
  create: (context) => {
    const [config = {}] = context.options;
    const { allowProtected = false } = config;
    const { couldBeSubject, couldBeType } = getTypeServices(context);

    const messageId = allowProtected ? 'forbiddenAllowProtected' : 'forbidden';
    const accessibilityRexExp = allowProtected
      ? /^(private|protected)$/
      : /^private$/;

    function isSubject(node: es.Node) {
      return (
        couldBeSubject(node) && !couldBeType(node, defaultAllowedTypesRegExp)
      );
    }

    return {
      [`PropertyDefinition[accessibility!=${accessibilityRexExp}]`]: (
        node: es.PropertyDefinition,
      ) => {
        if (isSubject(node)) {
          const { key } = node;
          if (isIdentifier(key)) {
            context.report({
              messageId,
              node: key,
              data: {
                subject: key.name,
              },
            });
          }
        }
      },
      [`MethodDefinition[kind='constructor'] > FunctionExpression > TSParameterProperty[accessibility!=${accessibilityRexExp}] > Identifier`]:
        (node: es.Identifier) => {
          if (isSubject(node)) {
            const { loc } = node;
            context.report({
              messageId,
              loc: {
                ...loc,
                end: {
                  ...loc.start,
                  column: loc.start.column + node.name.length,
                },
              },
              data: {
                subject: node.name,
              },
            });
          }
        },
      [`MethodDefinition[accessibility!=${accessibilityRexExp}][kind=/^(get|set)$/]`]:
        (node: es.MethodDefinition) => {
          if (isSubject(node)) {
            const key = node.key as es.Identifier;
            context.report({
              messageId,
              node: key,
              data: {
                subject: key.name,
              },
            });
          }
        },
      [`MethodDefinition[accessibility!=${accessibilityRexExp}][kind='method']`]:
        (node: es.MethodDefinition) => {
          const functionExpression = node.value;
          const returnType = functionExpression.returnType;
          if (!returnType) {
            return;
          }

          const typeAnnotation = returnType.typeAnnotation;
          if (!typeAnnotation) {
            return;
          }

          if (isSubject(typeAnnotation)) {
            const key = node.key as es.Identifier;
            context.report({
              messageId,
              node: key,
              data: {
                subject: key.name,
              },
            });
          }
        },
    };
  },
});
