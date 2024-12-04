import { TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import { getTypeServices, isIdentifier, isMemberExpression, isObjectExpression, isProperty } from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredErrorRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow calling `subscribe` without specifying an error handler.',
      recommended: 'strict',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Calling subscribe without an error handler is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-error',
  create: (context) => {
    const { getTypeAtLocation } = ESLintUtils.getParserServices(context);
    const { couldBeObservable, couldBeFunction } = getTypeServices(context);

    function isMissingErrorCallback(callExpression: es.CallExpression): boolean {
      if (callExpression.arguments.length >= 2) {
        return false;
      }
      return couldBeFunction(callExpression.arguments[0]);
    }

    function isObjMissingError(arg: es.ObjectExpression): boolean {
      return !arg.properties.some(
        property =>
          isProperty(property)
          && isIdentifier(property.key)
          && property.key.name === 'error',
      );
    }

    function isTypeMissingError(arg: es.Identifier): boolean {
      const argType = getTypeAtLocation(arg);
      return !argType?.getProperties().some(p => p.name === 'error');
    }

    function isMissingErrorProperty(callExpression: es.CallExpression): boolean {
      if (callExpression.arguments.length !== 1) {
        return false;
      }

      const [arg] = callExpression.arguments;

      if (isObjectExpression(arg)) {
        return isObjMissingError(arg);
      }
      if (isIdentifier(arg)) {
        return isTypeMissingError(arg);
      }
      if (isMemberExpression(arg) && isIdentifier(arg.property)) {
        return isTypeMissingError(arg.property);
      }
      return false;
    }

    return {
      'CallExpression[arguments.length > 0] > MemberExpression > Identifier[name=\'subscribe\']':
        (node: es.Identifier) => {
          const memberExpression = node.parent as es.MemberExpression;
          const callExpression = memberExpression.parent as es.CallExpression;

          if (
            (isMissingErrorCallback(callExpression)
              || isMissingErrorProperty(callExpression))
            && couldBeObservable(memberExpression.object)
          ) {
            context.report({
              messageId: 'forbidden',
              node,
            });
          }
        },
    };
  },
});
