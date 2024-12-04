import { AST_NODE_TYPES, TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import {
  findParent,
  getLoc,
  getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

const defaultOptions: readonly {
  functions?: boolean;
  methods?: boolean;
  names?: Record<string, boolean>;
  parameters?: boolean;
  properties?: boolean;
  strict?: boolean;
  types?: Record<string, boolean>;
  variables?: boolean;
}[] = [];

export const finnishRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Enforce Finnish notation.',
      requiresTypeChecking: true,
    },
    messages: {
      shouldBeFinnish: 'Finnish notation should be used here.',
      shouldNotBeFinnish: 'Finnish notation should not be used here.',
    },
    schema: [
      {
        properties: {
          functions: { type: 'boolean', description: 'Require for functions.' },
          methods: { type: 'boolean', description: 'Require for methods.' },
          names: { type: 'object', description: 'Enforce for specific names. Keys are a RegExp, values are a boolean.' },
          parameters: { type: 'boolean', description: 'Require for parameters.' },
          properties: { type: 'boolean', description: 'Require for properties.' },
          strict: { type: 'boolean', description: 'Disallow Finnish notation for non-Observables.' },
          types: { type: 'object', description: 'Enforce for specific types. Keys are a RegExp, values are a boolean.' },
          variables: { type: 'boolean', description: 'Require for variables.' },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'finnish',
  create: (context) => {
    const { esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(context);
    const {
      couldBeObservable,
      couldBeType,
      couldReturnObservable,
      couldReturnType,
    } = getTypeServices(context);
    const [config = {}] = context.options;

    const { strict = false } = config;
    const validate = {
      functions: true,
      methods: true,
      parameters: true,
      properties: true,
      variables: true,
      ...(config as Record<string, unknown>),
    };

    const names: { regExp: RegExp; validate: boolean }[] = [];
    if (config.names) {
      Object.entries(config.names).forEach(
        ([key, validate]: [string, boolean]) => {
          names.push({ regExp: new RegExp(key), validate });
        },
      );
    } else {
      names.push({
        regExp:
          /^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate)$/,
        validate: false,
      });
    }

    const types: { regExp: RegExp; validate: boolean }[] = [];
    if (config.types) {
      Object.entries(config.types).forEach(
        ([key, validate]: [string, boolean]) => {
          types.push({ regExp: new RegExp(key), validate });
        },
      );
    } else {
      types.push({
        regExp: /^EventEmitter$/,
        validate: false,
      });
    }

    function checkNode(nameNode: es.Node, typeNode?: es.Node) {
      const tsNode = esTreeNodeToTSNodeMap.get(nameNode);
      const text = tsNode.getText();
      const hasFinnish = text.endsWith('$');
      if (hasFinnish && !strict) {
        return;
      }
      const shouldBeFinnish = hasFinnish
        ? () => { /* noop */ }
        : () => {
            context.report({
              loc: getLoc(tsNode),
              messageId: 'shouldBeFinnish',
            });
          };
      const shouldNotBeFinnish = hasFinnish
        ? () => {
            context.report({
              loc: getLoc(tsNode),
              messageId: 'shouldNotBeFinnish',
            });
          }
        : () => { /* noop */ };
      if (
        couldBeObservable(typeNode ?? nameNode)
        || couldReturnObservable(typeNode ?? nameNode)
      ) {
        for (const name of names) {
          const { regExp, validate } = name;
          if (regExp.test(text) && !validate) {
            shouldNotBeFinnish();
            return;
          }
        }
        for (const type of types) {
          const { regExp, validate } = type;
          if (
            (couldBeType(typeNode ?? nameNode, regExp)
              || couldReturnType(typeNode ?? nameNode, regExp))
            && !validate
          ) {
            shouldNotBeFinnish();
            return;
          }
        }
        shouldBeFinnish();
      } else {
        shouldNotBeFinnish();
      }
    }

    return {
      'ArrayPattern > Identifier': (node: es.Identifier) => {
        const found = findParent(
          node,
          'ArrowFunctionExpression',
          'FunctionDeclaration',
          'FunctionExpression',
          'VariableDeclarator',
        );
        if (!found) {
          return;
        }
        if (!validate.variables && found.type === AST_NODE_TYPES.VariableDeclarator) {
          return;
        }
        if (!validate.parameters) {
          return;
        }
        checkNode(node);
      },
      'ArrowFunctionExpression > Identifier': (node: es.Identifier) => {
        if (validate.parameters) {
          const parent = node.parent as es.ArrowFunctionExpression;
          if (node !== parent.body) {
            checkNode(node);
          }
        }
      },
      'PropertyDefinition[computed=false]': (node: es.PropertyDefinition) => {
        if (validate.properties) {
          checkNode(node.key);
        }
      },
      'FunctionDeclaration > Identifier': (node: es.Identifier) => {
        const parent = node.parent as es.FunctionDeclaration;
        if (node === parent.id) {
          if (validate.functions) {
            checkNode(node, parent);
          }
        } else {
          if (validate.parameters) {
            checkNode(node);
          }
        }
      },
      'FunctionExpression > Identifier': (node: es.Identifier) => {
        const parent = node.parent as es.FunctionExpression;
        if (node === parent.id) {
          if (validate.functions) {
            checkNode(node, parent);
          }
        } else {
          if (validate.parameters) {
            checkNode(node);
          }
        }
      },
      'MethodDefinition[kind=\'get\'][computed=false]': (
        node: es.MethodDefinition,
      ) => {
        if (validate.properties) {
          checkNode(node.key, node);
        }
      },
      'MethodDefinition[kind=\'method\'][computed=false]': (
        node: es.MethodDefinition,
      ) => {
        if (validate.methods) {
          checkNode(node.key, node);
        }
      },
      'MethodDefinition[kind=\'set\'][computed=false]': (
        node: es.MethodDefinition,
      ) => {
        if (validate.properties) {
          checkNode(node.key, node);
        }
      },
      'ObjectExpression > Property[computed=false] > Identifier': (
        node: es.Identifier,
      ) => {
        if (validate.properties) {
          const parent = node.parent as es.Property;
          if (node === parent.key) {
            checkNode(node);
          }
        }
      },
      'ObjectPattern > Property > Identifier': (node: es.Identifier) => {
        const found = findParent(
          node,
          'ArrowFunctionExpression',
          'FunctionDeclaration',
          'FunctionExpression',
          'VariableDeclarator',
        );
        if (!found) {
          return;
        }
        if (!validate.variables && found.type === AST_NODE_TYPES.VariableDeclarator) {
          return;
        }
        if (!validate.parameters) {
          return;
        }
        const parent = node.parent as es.Property;
        if (node === parent.value) {
          checkNode(node);
        }
      },
      'TSCallSignatureDeclaration > Identifier': (node: es.Identifier) => {
        if (validate.parameters) {
          checkNode(node);
        }
      },
      'TSConstructSignatureDeclaration > Identifier': (node: es.Identifier) => {
        if (validate.parameters) {
          checkNode(node);
        }
      },
      'TSMethodSignature[computed=false]': (node: es.TSMethodSignature) => {
        if (validate.methods) {
          checkNode(node.key, node);
        }
        if (validate.parameters) {
          node.params.forEach((param: es.Node) => {
            checkNode(param);
          });
        }
      },
      'TSParameterProperty > Identifier': (node: es.Identifier) => {
        if (validate.parameters || validate.properties) {
          checkNode(node);
        }
      },
      'TSPropertySignature[computed=false]': (node: es.TSPropertySignature) => {
        if (validate.properties) {
          checkNode(node.key);
        }
      },
      'VariableDeclarator > Identifier': (node: es.Identifier) => {
        const parent = node.parent as es.VariableDeclarator;
        if (validate.variables && node === parent.id) {
          checkNode(node);
        }
      },
    };
  },
});
