/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import { getLoc } from "eslint-etc";
import * as es from "estree";
import { getParent, typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Enforces the use of a suffix in subject identifiers.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: `Subject identifiers must end with "{{suffix}}".`,
    },
    schema: [
      {
        properties: {
          parameters: { type: "boolean" },
          properties: { type: "boolean" },
          suffix: { type: "string" },
          types: { type: "object" },
          variables: { type: "boolean" },
        },
        type: "object",
      },
    ],
  },
  create: (context) => {
    const { couldBeType, nodeMap } = typecheck(context);
    const [config = {}] = context.options;

    const validate = {
      parameters: true,
      properties: true,
      variables: true,
      ...(config as {}),
    };

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

    const { suffix = "Subject" } = config;
    const suffixRegex = new RegExp(String.raw`${suffix}\$?$`, "i");

    function asParam(node: es.Node): es.Node {
      const anyNode = node as any;
      return anyNode.type === "TSParameterProperty" ? anyNode.parameter : node;
    }

    function checkNode(nameNode: es.Node, typeNode?: es.Node) {
      let tsNode = nodeMap.get(nameNode);
      const text = tsNode.getText();
      if (
        !suffixRegex.test(text) &&
        couldBeType(typeNode || nameNode, "Subject")
      ) {
        for (let i = 0; i < types.length; ++i) {
          const { regExp, validate } = types[i];
          if (couldBeType(typeNode || nameNode, regExp) && !validate) {
            return;
          }
        }
        context.report({
          data: { suffix },
          loc: getLoc(tsNode),
          messageId: "forbidden",
        });
      }
    }

    return {
      ArrowFunctionExpression: (node: es.ArrowFunctionExpression) => {
        if (validate.parameters) {
          node.params.forEach((param) => checkNode(asParam(param)));
        }
      },
      "ClassProperty[key.name=/[^$]$/][computed=false]": (node: es.Node) => {
        const anyNode = node as any;
        if (validate.properties) {
          checkNode(anyNode.key);
        }
      },
      FunctionDeclaration: (node: es.FunctionDeclaration) => {
        if (validate.parameters) {
          node.params.forEach((param) => checkNode(asParam(param)));
        }
      },
      FunctionExpression: (node: es.FunctionExpression) => {
        if (validate.parameters) {
          node.params.forEach((param) => checkNode(asParam(param)));
        }
      },
      "MethodDefinition[kind='get'][computed=false]": (
        node: es.MethodDefinition
      ) => {
        if (validate.properties) {
          checkNode(node.key, node);
        }
      },
      "MethodDefinition[kind='set'][computed=false]": (
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
          anyNode.params.forEach((param: es.Node) => checkNode(asParam(param)));
        }
        // TODO: add tests
      },
      TSConstructSignatureDeclaration: (node: es.Node) => {
        const anyNode = node as any;
        if (validate.parameters) {
          anyNode.params.forEach((param: es.Node) => checkNode(asParam(param)));
        }
        // TODO: add tests
      },
      "TSMethodSignature[computed=false]": (node: es.Node) => {
        const anyNode = node as any;
        if (validate.parameters) {
          anyNode.params.forEach((param: es.Node) => checkNode(asParam(param)));
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
