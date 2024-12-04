import { TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import {
  getLoc,
  getTypeServices,
} from '../etc';
import { ruleCreator } from '../utils';

export const noFinnishRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow Finnish notation.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Finnish notation is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-finnish',
  create: (context) => {
    const { esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(context);
    const { couldBeObservable, couldReturnObservable }
      = getTypeServices(context);

    function checkNode(nameNode: es.Node, typeNode?: es.Node) {
      if (
        couldBeObservable(typeNode ?? nameNode)
        || couldReturnObservable(typeNode ?? nameNode)
      ) {
        const tsNode = esTreeNodeToTSNodeMap.get(nameNode);
        if (/[$]+$/.test(tsNode.getText())) {
          context.report({
            loc: getLoc(tsNode),
            messageId: 'forbidden',
          });
        }
      }
    }

    return {
      'ArrayPattern > Identifier[name=/[$]+$/]': (node: es.Identifier) => {
        checkNode(node);
      },
      'ArrowFunctionExpression > Identifier[name=/[$]+$/]': (
        node: es.Identifier,
      ) => {
        const parent = node.parent as es.ArrowFunctionExpression;
        if (node !== parent.body) {
          checkNode(node);
        }
      },
      'PropertyDefinition[key.name=/[$]+$/] > Identifier': (
        node: es.Identifier,
      ) => { checkNode(node, node.parent); },
      'FunctionDeclaration > Identifier[name=/[$]+$/]': (
        node: es.Identifier,
      ) => {
        const parent = node.parent as es.FunctionDeclaration;
        if (node === parent.id) {
          checkNode(node, parent);
        } else {
          checkNode(node);
        }
      },
      'FunctionExpression > Identifier[name=/[$]+$/]': (
        node: es.Identifier,
      ) => {
        const parent = node.parent as es.FunctionExpression;
        if (node === parent.id) {
          checkNode(node, parent);
        } else {
          checkNode(node);
        }
      },
      'MethodDefinition[key.name=/[$]+$/]': (node: es.MethodDefinition) => {
        checkNode(node.key, node);
      },
      'ObjectExpression > Property[computed=false][key.name=/[$]+$/]': (
        node: es.Property,
      ) => { checkNode(node.key); },
      'ObjectPattern > Property[value.name=/[$]+$/]': (node: es.Property) => {
        checkNode(node.value);
      },
      'TSCallSignatureDeclaration > Identifier[name=/[$]+$/]': (
        node: es.Node,
      ) => { checkNode(node); },
      'TSConstructSignatureDeclaration > Identifier[name=/[$]+$/]': (
        node: es.Node,
      ) => { checkNode(node); },
      'TSParameterProperty > Identifier[name=/[$]+$/]': (node: es.Identifier) => {
        checkNode(node);
      },
      'TSPropertySignature > Identifier[name=/[$]+$/]': (node: es.Identifier) => {
        checkNode(node, node.parent);
      },
      'TSMethodSignature > Identifier[name=/[$]+$/]': (node: es.Identifier) => {
        const parent = node.parent as es.TSMethodSignature;
        if (node === parent.key) {
          checkNode(node, parent);
        } else {
          checkNode(node);
        }
      },
      'VariableDeclarator[id.name=/[$]+$/]': (node: es.VariableDeclarator) => {
        checkNode(node.id, node.init ?? node);
      },
    };
  },
});
