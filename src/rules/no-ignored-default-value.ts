import { TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import { getTypeServices, isIdentifier, isMemberExpression, isObjectExpression, isProperty } from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredDefaultValueRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow using `firstValueFrom`, `lastValueFrom`, `first`, and `last` without specifying a default value.',
      recommended: 'strict',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Not specifying a default value is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-default-value',
  create: (context) => {
    const { getTypeAtLocation } = ESLintUtils.getParserServices(context);
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    function checkConfigObj(configArg: es.ObjectExpression) {
      if (!configArg.properties.some(p => isProperty(p) && isIdentifier(p.key) && p.key.name === 'defaultValue')) {
        context.report({
          messageId: 'forbidden',
          node: configArg,
        });
      }
    }

    function checkConfigType(configArg: es.Node) {
      const configArgType = getTypeAtLocation(configArg);
      if (!configArgType?.getProperties().some(p => p.name === 'defaultValue')) {
        context.report({
          messageId: 'forbidden',
          node: configArg,
        });
      }
    }

    function checkArg(arg: es.Node) {
      if (isIdentifier(arg)) {
        checkConfigType(arg);
        return;
      } else if (isMemberExpression(arg) && isIdentifier(arg.property)) {
        checkConfigType(arg.property);
        return;
      }
      if (!isObjectExpression(arg)) {
        return;
      }
      checkConfigObj(arg);
    }

    function checkFunctionArgs(node: es.Node, args: es.CallExpressionArgument[]) {
      if (!couldBeType(node, 'firstValueFrom', { name: /[/\\]rxjs[/\\]/ })
        && !couldBeType(node, 'lastValueFrom', { name: /[/\\]rxjs[/\\]/ })) {
        return;
      }
      if (!args || args.length <= 0) {
        return;
      }
      const [observableArg, configArg] = args;
      if (!couldBeObservable(observableArg)) {
        return;
      }
      if (!configArg) {
        context.report({
          messageId: 'forbidden',
          node,
        });
        return;
      }
      checkArg(configArg);
    }

    function checkOperatorArgs(node: es.Node, args: es.CallExpressionArgument[]) {
      if (!couldBeType(node, 'first', { name: /[/\\]rxjs[/\\]/ })
        && !couldBeType(node, 'last', { name: /[/\\]rxjs[/\\]/ })) {
        return;
      }

      if (!args || args.length <= 0) {
        context.report({
          messageId: 'forbidden',
          node,
        });
        return;
      }
      const [arg] = args;
      checkArg(arg);
    }

    return {
      'CallExpression[callee.name=/^(firstValueFrom|lastValueFrom)$/]': (node: es.CallExpression) => {
        checkFunctionArgs(node.callee, node.arguments);
      },
      'CallExpression[callee.property.name=/^(firstValueFrom|lastValueFrom)$/]': (node: es.CallExpression) => {
        const memberExpression = node.callee as es.MemberExpression;
        checkFunctionArgs(memberExpression.property, node.arguments);
      },
      'CallExpression[callee.property.name=\'pipe\'] > CallExpression[callee.name=/^(first|last)$/]': (node: es.CallExpression) => {
        checkOperatorArgs(node.callee, node.arguments);
      },
      'CallExpression[callee.property.name=\'pipe\'] > CallExpression[callee.property.name=/^(first|last)$/]': (node: es.CallExpression) => {
        const memberExpression = node.callee as es.MemberExpression;
        checkOperatorArgs(memberExpression.property, node.arguments);
      },
    };
  },
});
