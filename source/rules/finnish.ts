/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import { getLoc } from "eslint-etc";
import * as es from "estree";
import { getParent, typecheck } from "../utils";

const defaultNamesRegExp = /^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate)$/;
const defaultTypesRegExp = /^EventEmitter$/;

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
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
  },
  create: (context) => {
    const {
      couldBeObservable,
      couldBeType,
      couldReturnObservable,
      couldReturnType,
      nodeMap,
    } = typecheck(context);
    const [config = {}] = context.options;
    const names: { regExp: RegExp; validate: boolean }[] = [];
    const types: { regExp: RegExp; validate: boolean }[] = [];
    const validate = {
      functions: true,
      methods: true,
      parameters: true,
      properties: true,
      variables: true,
      ...(config as {}),
    };
    if (config.names) {
      Object.entries(config.names).forEach(
        ([key, validate]: [string, boolean]) => {
          names.push({ regExp: new RegExp(key), validate });
        }
      );
    } else {
      names.push({ regExp: defaultNamesRegExp, validate: false });
    }
    if (config.types) {
      Object.entries(config.types).forEach(
        ([key, validate]: [string, boolean]) => {
          types.push({ regExp: new RegExp(key), validate });
        }
      );
    } else {
      types.push({ regExp: defaultTypesRegExp, validate: false });
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
      ArrowFunctionExpression: (node: es.ArrowFunctionExpression) => {
        if (validate.parameters) {
          node.params.forEach((param) => checkNode(param));
        }
      },
      "ClassProperty[key.name=/[^$]$/][computed=false]": (node: es.Node) => {
        const anyNode = node as any;
        if (validate.properties) {
          checkNode(anyNode.key);
        }
      },
      FunctionDeclaration: (node: es.FunctionDeclaration) => {
        if (validate.functions) {
          checkNode(node.id, node);
        }
        if (validate.parameters) {
          node.params.forEach((param) => checkNode(param));
        }
      },
      FunctionExpression: (node: es.FunctionExpression) => {
        if (validate.parameters) {
          node.params.forEach((param) => checkNode(param));
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
      TSCallSignatureDeclaration: (node: es.Node) => {
        const anyNode = node as any;
        if (validate.parameters) {
          anyNode.params.forEach((param: es.Node) => checkNode(param));
        }
        // TODO: add tests
      },
      TSConstructSignatureDeclaration: (node: es.Node) => {
        const anyNode = node as any;
        if (validate.parameters) {
          anyNode.params.forEach((param: es.Node) => checkNode(param));
        }
        // TODO: add tests
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
      "TSPropertySignature[key.name=/[^$]$/][computed=false]": (
        node: es.Node
      ) => {
        const anyNode = node as any;
        if (validate.properties) {
          checkNode(anyNode.key);
        }
      },
      "VariableDeclarator > ArrayPattern > Identifier[name=/[^$]$/]": (
        node: es.Identifier
      ) => {
        if (validate.variables) {
          checkNode(node);
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
      "VariableDeclarator > ObjectPattern > Property > Identifier[name=/[^$]$/]": (
        node: es.Identifier
      ) => {
        const parent = getParent(node) as es.Property;
        if (validate.variables && node === parent.value) {
          checkNode(node);
        }
      },
    };
  },
};

export = rule;
