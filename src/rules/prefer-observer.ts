import {
  TSESTree as es,
  TSESLint as eslint,
} from '@typescript-eslint/utils';
import {
  getTypeServices,
  isArrowFunctionExpression,
  isFunctionExpression,
  isMemberExpression,
} from '../etc';
import { ruleCreator } from '../utils';

const defaultOptions: readonly {
  allowNext?: boolean;
}[] = [];

export const preferObserverRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description:
        'Disallow passing separate handlers to `subscribe` and `tap`.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      forbidden:
        'Passing separate handlers is forbidden; pass an observer instead.',
    },
    schema: [
      {
        properties: {
          allowNext: { type: 'boolean', description: 'Allows a single `next` callback.', default: true },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'prefer-observer',
  create: (context) => {
    const { couldBeFunction, couldBeObservable } = getTypeServices(context);
    const [config = {}] = context.options;
    const { allowNext = true } = config;

    function checkArgs(callExpression: es.CallExpression, reportNode: es.Node) {
      const { arguments: args, callee } = callExpression;
      if (isMemberExpression(callee) && !couldBeObservable(callee.object)) {
        return;
      }

      function* fix(fixer: eslint.RuleFixer) {
        const sourceCode = context.sourceCode;
        const [nextArg, errorArg, completeArg] = args;
        const nextArgText = nextArg ? sourceCode.getText(nextArg) : '';
        const errorArgText = errorArg ? sourceCode.getText(errorArg) : '';
        const completeArgText = completeArg
          ? sourceCode.getText(completeArg)
          : '';
        let observer = '{';
        if (
          nextArgText
          && nextArgText !== 'undefined'
          && nextArgText !== 'null'
        ) {
          observer += ` next: ${nextArgText}${
            isValidArgText(errorArgText) || isValidArgText(completeArgText)
              ? ','
              : ''
          }`;
        }
        if (
          errorArgText
          && errorArgText !== 'undefined'
          && errorArgText !== 'null'
        ) {
          observer += ` error: ${errorArgText}${
            isValidArgText(completeArgText) ? ',' : ''
          }`;
        }
        if (
          completeArgText
          && completeArgText !== 'undefined'
          && completeArgText !== 'null'
        ) {
          observer += ` complete: ${completeArgText}`;
        }
        observer += ' }';

        yield fixer.replaceText(callExpression.arguments[0], observer);

        const [, start] = callExpression.arguments[0].range;
        const [, end]
          = callExpression.arguments[callExpression.arguments.length - 1].range;
        yield fixer.removeRange([start, end]);
      }

      if (args.length > 1) {
        context.report({
          messageId: 'forbidden',
          node: reportNode,
          fix,
          suggest: [
            {
              messageId: 'forbidden',
              fix,
            },
          ],
        });
      } else if (args.length === 1 && !allowNext) {
        const [arg] = args;
        if (
          isArrowFunctionExpression(arg)
          || isFunctionExpression(arg)
          || couldBeFunction(arg)
        ) {
          context.report({
            messageId: 'forbidden',
            node: reportNode,
            fix,
            suggest: [
              {
                messageId: 'forbidden',
                fix,
              },
            ],
          });
        }
      }
    }

    return {
      'CallExpression[callee.property.name=\'pipe\'] > CallExpression[callee.name=\'tap\']':
        (node: es.CallExpression) => { checkArgs(node, node.callee); },
      'CallExpression[callee.property.name=\'subscribe\']': (
        node: es.CallExpression,
      ) => { checkArgs(node, (node.callee as es.MemberExpression).property); },
    };
  },
});

function isValidArgText(argText: string) {
  return argText && argText !== 'undefined' && argText !== 'null';
}
