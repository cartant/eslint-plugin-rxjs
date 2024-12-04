import {
  AST_NODE_TYPES,
  TSESTree as es,
  TSESLint as eslint,
} from '@typescript-eslint/utils';
import {
  getTypeServices,
  hasTypeAnnotation,
  isArrowFunctionExpression,
  isFunctionExpression,
  isIdentifier,
  isMemberExpression,
  isObjectExpression,
  isProperty } from '../etc';
import { ruleCreator } from '../utils';

function isParenthesised(
  sourceCode: Readonly<eslint.SourceCode>,
  node: es.Node,
) {
  const before = sourceCode.getTokenBefore(node);
  const after = sourceCode.getTokenAfter(node);
  return (
    before
    && after
    && before.value === '('
    && before.range[1] <= node.range[0]
    && after.value === ')'
    && after.range[0] >= node.range[1]
  );
}

const defaultOptions: readonly {
  allowExplicitAny?: boolean;
}[] = [];

export const noImplicitAnyCatchRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description:
        'Disallow implicit `any` error parameters in `catchError` operators.',
      recommended: {
        recommended: true,
        strict: [{
          allowExplicitAny: false,
        }],
      },
      requiresTypeChecking: true,
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      explicitAny: 'Explicit `any` in `catchError`.',
      implicitAny: 'Implicit `any` in `catchError`.',
      narrowed: 'Error type must be `unknown` or `any`.',
      suggestExplicitUnknown:
        'Use `unknown` instead, this will force you to explicitly and safely assert the type is correct.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowExplicitAny: {
            type: 'boolean',
            description: 'Allow error variable to be explicitly typed as `any`.',
            default: true,
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'no-implicit-any-catch',
  create: (context) => {
    const [config = {}] = context.options;
    const { allowExplicitAny = true } = config;
    const { couldBeObservable } = getTypeServices(context);
    const sourceCode = context.sourceCode;

    function checkCallback(callback: es.Node) {
      if (
        isArrowFunctionExpression(callback)
        || isFunctionExpression(callback)
      ) {
        const [param] = callback.params;
        if (!param) {
          return;
        }
        if (hasTypeAnnotation(param)) {
          const { typeAnnotation } = param;
          const {
            typeAnnotation: { type },
          } = typeAnnotation;
          if (type === AST_NODE_TYPES.TSAnyKeyword) {
            if (allowExplicitAny) {
              return;
            }
            function fix(fixer: eslint.RuleFixer) {
              return fixer.replaceText(typeAnnotation, ': unknown');
            }
            context.report({
              fix,
              messageId: 'explicitAny',
              node: param,
              suggest: [
                {
                  messageId: 'suggestExplicitUnknown',
                  fix,
                },
              ],
            });
          } else if (type !== AST_NODE_TYPES.TSUnknownKeyword) {
            function fix(fixer: eslint.RuleFixer) {
              return fixer.replaceText(typeAnnotation, ': unknown');
            }
            context.report({
              messageId: 'narrowed',
              node: param,
              suggest: [
                {
                  messageId: 'suggestExplicitUnknown',
                  fix,
                },
              ],
            });
          }
        } else {
          function fix(fixer: eslint.RuleFixer) {
            if (isParenthesised(sourceCode, param)) {
              return fixer.insertTextAfter(param, ': unknown');
            }
            return [
              fixer.insertTextBefore(param, '('),
              fixer.insertTextAfter(param, ': unknown)'),
            ];
          }
          context.report({
            fix,
            messageId: 'implicitAny',
            node: param,
            suggest: [
              {
                messageId: 'suggestExplicitUnknown',
                fix,
              },
            ],
          });
        }
      }
    }

    return {
      'CallExpression[callee.name=\'catchError\']': (node: es.CallExpression) => {
        const [callback] = node.arguments;
        if (!callback) {
          return;
        }
        checkCallback(callback);
      },
      'CallExpression[callee.property.name=\'subscribe\'],CallExpression[callee.name=\'tap\']':
        (node: es.CallExpression) => {
          const { callee } = node;
          if (isMemberExpression(callee) && !couldBeObservable(callee.object)) {
            return;
          }
          const [observer, callback] = node.arguments;
          if (callback) {
            checkCallback(callback);
          } else if (observer && isObjectExpression(observer)) {
            const errorProperty = observer.properties.find(
              (property) =>
                isProperty(property)
                && isIdentifier(property.key)
                && property.key.name === 'error',
            ) as es.Property;
            if (errorProperty) {
              checkCallback(errorProperty.value);
            }
          }
        },
    };
  },
});
