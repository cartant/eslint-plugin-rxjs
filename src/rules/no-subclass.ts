import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noSubclassRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow subclassing RxJS classes.',
      recommended: 'strict',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Subclassing RxJS classes is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subclass',
  create: (context) => {
    const { couldBeType } = getTypeServices(context);

    const queryNames = [
      'AsyncSubject',
      'BehaviorSubject',
      'Observable',
      'ReplaySubject',
      'Scheduler',
      'Subject',
      'Subscriber',
    ];

    return {
      [`ClassDeclaration[superClass.name=/^(${queryNames.join(
        '|',
      )})$/] > Identifier.superClass`]: (node: es.Identifier) => {
        if (
          queryNames.some((name) =>
            couldBeType(node, name, { name: /[/\\]rxjs[/\\]/ }),
          )
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
