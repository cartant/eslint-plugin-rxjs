import { TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';
import ts from 'typescript';
import {
  couldBeType,
  isMemberExpression,
} from '../etc';
import { ruleCreator } from '../utils';

export const noUnsafeSubjectNext = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow unsafe optional `next` calls.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Unsafe optional next calls are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-unsafe-subject-next',
  create: (context) => {
    const { getTypeAtLocation, program } = ESLintUtils.getParserServices(context);
    const typeChecker = program.getTypeChecker();

    return {
      [`CallExpression[callee.property.name='next']`]: (
        node: es.CallExpression,
      ) => {
        if (node.arguments.length === 0 && isMemberExpression(node.callee)) {
          const type = getTypeAtLocation(node.callee.object);
          if (tsutils.isTypeReference(type) && couldBeType(type, 'Subject')) {
            const [typeArg] = typeChecker.getTypeArguments(type);
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Any)) {
              return;
            }
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Unknown)) {
              return;
            }
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Void)) {
              return;
            }
            if (
              tsutils.isUnionType(typeArg)
              && typeArg.types.some((t) =>
                tsutils.isTypeFlagSet(t, ts.TypeFlags.Void),
              )
            ) {
              return;
            }
            context.report({
              messageId: 'forbidden',
              node: node.callee.property,
            });
          }
        }
      },
    };
  },
});
