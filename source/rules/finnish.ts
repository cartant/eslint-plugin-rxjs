/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { findParent, getLoc, getParent, getTypeServices } from "eslint-etc";
import { ruleCreator } from "../utils";

const defaultOptions: {
  functions?: boolean;
  methods?: boolean;
  names?: Record<string, boolean>;
  parameters?: boolean;
  properties?: boolean;
  types?: Record<string, boolean>;
  variables?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description: "Enforces the use of Finnish notation.",
      recommended: false,
    },
    fixable: "code",
    messages: {
      forbidden: "Use Finnish notation.",
    },
    schema: [
      {
        properties: {
          functions: { type: "boolean" },
          methods: { type: "boolean" },
          names: { type: "object" },
          parameters: { type: "boolean" },
          properties: { type: "boolean" },
          types: { type: "object" },
          variables: { type: "boolean" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "finnish",
  create: (context, unused: typeof defaultOptions) => {
    const {
      couldBeObservable,
      couldBeType,
      couldReturnObservable,
      couldReturnType,
      nodeMap,
    } = getTypeServices(context);
    const [config = {}] = context.options;

    const validate = {
      functions: true,
      methods: true,
      parameters: true,
      properties: true,
      variables: true,
      ...(config as {}),
    };

    const names: { regExp: RegExp; validate: boolean }[] = [];
    if (config.names) {
      Object.entries(config.names).forEach(
        ([key, validate]: [string, boolean]) => {
          names.push({ regExp: new RegExp(key), validate });
        }
      );
    } else {
      names.push({
        regExp: /^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate)$/,
        validate: false,
      });
    }

    const types: { regExp: RegExp; validate: boolean }[] = [];
    if (config.types) {
      Object.entries(config.types).forEach(
        ([key, validate]: [string, boolean]) => {
          types.push({ regExp: new RegExp(key), validate });
        }
      );
    } else {
      types.push({
        regExp: /^EventEmitter$/,
        validate: false,
      });
    }

    function checkNode(nameNode: es.Node, typeNode?: es.Node) {
      let tsNode = nodeMap.get(nameNode);
      const text = tsNode.getText();
      if (
        !/\$$/.test(text) &&
        (couldBeObservable(typeNode || nameNode) ||
          couldReturnObservable(typeNode || nameNode))
      ) {
        for (let i = 0; i < names.length; ++i) {
          const { regExp, validate } = names[i];
          if (regExp.test(text) && !validate) {
            return;
          }
        }
        for (let i = 0; i < types.length; ++i) {
          const { regExp, validate } = types[i];
          if (
            (couldBeType(typeNode || nameNode, regExp) ||
              couldReturnType(typeNode || nameNode, regExp)) &&
            !validate
          ) {
            return;
          }
        }
        context.report({
          loc: getLoc(tsNode),
          messageId: "forbidden",
        });
      }
    }

    return {
      "ArrayPattern > Identifier[name=/[^$]$/]": (node: es.Identifier) => {
        const found = findParent(
          node,
          "ArrowFunctionExpression",
          "FunctionDeclaration",
          "FunctionExpression",
          "VariableDeclarator"
        );
        if (!found) {
          return;
        }
        if (!validate.variables && found.type === "VariableDeclarator") {
          return;
        }
        if (!validate.parameters) {
          return;
        }
        checkNode(node);
      },
      "ArrowFunctionExpression > Identifier[name=/[^$]$/]": (
        node: es.Identifier
      ) => {
        if (validate.parameters) {
          const parent = getParent(node) as es.ArrowFunctionExpression;
          if (node !== parent.body) {
            checkNode(node);
          }
        }
      },
      "ClassProperty[key.name=/[^$]$/][computed=false]": (node: es.Node) => {
        const anyNode = node as any;
        if (validate.properties) {
          checkNode(anyNode.key);
        }
      },
      "FunctionDeclaration > Identifier[name=/[^$]$/]": (
        node: es.Identifier
      ) => {
        const parent = getParent(node) as es.FunctionDeclaration;
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
      "FunctionExpression > Identifier[name=/[^$]$/]": (
        node: es.Identifier
      ) => {
        const parent = getParent(node) as es.FunctionExpression;
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
      "MethodDefinition[kind='get'][key.name=/[^$]$/][computed=false]": (
        node: es.MethodDefinition
      ) => {
        if (validate.properties) {
          checkNode(node.key, node);
        }
      },
      "MethodDefinition[kind='method'][key.name=/[^$]$/][computed=false]": (
        node: es.MethodDefinition
      ) => {
        if (validate.methods) {
          checkNode(node.key, node);
        }
      },
      "MethodDefinition[kind='set'][key.name=/[^$]$/][computed=false]": (
        node: es.MethodDefinition
      ) => {
        if (validate.properties) {
          checkNode(node.key, node);
        }
      },
      "ObjectExpression > Property[computed=false] > Identifier[name=/[^$]$/]": (
        node: es.ObjectExpression
      ) => {
        if (validate.properties) {
          const parent = getParent(node) as es.Property;
          if (node === parent.key) {
            checkNode(node);
          }
        }
      },
      "ObjectPattern > Property > Identifier[name=/[^$]$/]": (
        node: es.Identifier
      ) => {
        const found = findParent(
          node,
          "ArrowFunctionExpression",
          "FunctionDeclaration",
          "FunctionExpression",
          "VariableDeclarator"
        );
        if (!found) {
          return;
        }
        if (!validate.variables && found.type === "VariableDeclarator") {
          return;
        }
        if (!validate.parameters) {
          return;
        }
        const parent = getParent(node) as es.Property;
        if (node === parent.value) {
          checkNode(node);
        }
      },
      "TSCallSignatureDeclaration > Identifier[name=/[^$]$/]": (
        node: es.Node
      ) => {
        if (validate.parameters) {
          checkNode(node);
        }
      },
      "TSConstructSignatureDeclaration > Identifier[name=/[^$]$/]": (
        node: es.Node
      ) => {
        if (validate.parameters) {
          checkNode(node);
        }
      },
      "TSMethodSignature[computed=false]": (node: es.Node) => {
        const anyNode = node as any;
        if (validate.methods) {
          checkNode(anyNode.key, node);
        }
        if (validate.parameters) {
          anyNode.params.forEach((param: es.Node) => checkNode(param));
        }
      },
      "TSParameterProperty > Identifier[name=/[^$]$/]": (
        node: es.Identifier
      ) => {
        if (validate.parameters || validate.properties) {
          checkNode(node);
        }
      },
      "TSPropertySignature[key.name=/[^$]$/][computed=false]": (
        node: es.Node
      ) => {
        const anyNode = node as any;
        if (validate.properties) {
          checkNode(anyNode.key);
        }
      },
      "VariableDeclarator > Identifier[name=/[^$]$/]": (
        node: es.Identifier
      ) => {
        const parent = getParent(node) as es.VariableDeclarator;
        if (validate.variables && node === parent.id) {
          checkNode(node);
        }
      },
    };
  },
});

export = rule;
