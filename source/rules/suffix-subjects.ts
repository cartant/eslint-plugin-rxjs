/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import {
  findParent,
  getLoc,
  getParent,
  getParserServices,
  getTypeServices,
} from "eslint-etc";
import { escapeRegExp, ruleCreator } from "../utils";

const defaultOptions: readonly {
  parameters?: boolean;
  properties?: boolean;
  suffix?: string;
  types?: Record<string, boolean>;
  variables?: boolean;
}[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: "Enforces the use of a suffix in subject identifiers.",
      recommended: false,
    },
    fixable: undefined,
    hasSuggestions: false,
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
    type: "problem",
  },
  name: "suffix-subjects",
  create: (context, unused: typeof defaultOptions) => {
    const { esTreeNodeToTSNodeMap } = getParserServices(context);
    const { couldBeType } = getTypeServices(context);
    const [config = {}] = context.options;

    const validate = {
      parameters: true,
      properties: true,
      variables: true,
      ...(config as Record<string, unknown>),
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
    const suffixRegex = new RegExp(
      String.raw`${escapeRegExp(suffix)}\$?$`,
      "i"
    );

    function checkNode(nameNode: es.Node, typeNode?: es.Node) {
      let tsNode = esTreeNodeToTSNodeMap.get(nameNode);
      const text = tsNode.getText();
      if (
        !suffixRegex.test(text) &&
        couldBeType(typeNode || nameNode, "Subject")
      ) {
        for (const type of types) {
          const { regExp, validate } = type;
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
      "ArrayPattern > Identifier": (node: es.Identifier) => {
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
      "ArrowFunctionExpression > Identifier": (node: es.Identifier) => {
        if (validate.parameters) {
          const parent = getParent(node) as es.ArrowFunctionExpression;
          if (node !== parent.body) {
            checkNode(node);
          }
        }
      },
      "PropertyDefinition[key.name=/[^$]$/][computed=false]": (
        node: es.PropertyDefinition
      ) => {
        const anyNode = node as any;
        if (validate.properties) {
          checkNode(anyNode.key);
        }
      },
      "FunctionDeclaration > Identifier": (node: es.Identifier) => {
        if (validate.parameters) {
          const parent = getParent(node) as es.FunctionDeclaration;
          if (node !== parent.id) {
            checkNode(node);
          }
        }
      },
      "FunctionExpression > Identifier": (node: es.Identifier) => {
        if (validate.parameters) {
          const parent = getParent(node) as es.FunctionExpression;
          if (node !== parent.id) {
            checkNode(node);
          }
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
      "ObjectExpression > Property[computed=false] > Identifier": (
        node: es.ObjectExpression
      ) => {
        if (validate.properties) {
          const parent = getParent(node) as es.Property;
          if (node === parent.key) {
            checkNode(node);
          }
        }
      },
      "ObjectPattern > Property > Identifier": (node: es.Identifier) => {
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
      "TSCallSignatureDeclaration > Identifier": (node: es.Node) => {
        if (validate.parameters) {
          checkNode(node);
        }
      },
      "TSConstructSignatureDeclaration > Identifier": (node: es.Node) => {
        if (validate.parameters) {
          checkNode(node);
        }
      },
      "TSMethodSignature > Identifier": (node: es.Node) => {
        if (validate.parameters) {
          checkNode(node);
        }
      },
      "TSParameterProperty > Identifier": (node: es.Identifier) => {
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
      "VariableDeclarator > Identifier": (node: es.Identifier) => {
        const parent = getParent(node) as es.VariableDeclarator;
        if (validate.variables && node === parent.id) {
          checkNode(node);
        }
      },
    };
  },
});

export = rule;
