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
import { ruleCreator } from "../utils";

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

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: "Enforces the use of Finnish notation.",
      recommended: false,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      shouldBeFinnish: "Finnish notation should be used here.",
      shouldNotBeFinnish: "Finnish notation should not be used here.",
    },
    schema: [
      {
        properties: {
          functions: { type: "boolean" },
          methods: { type: "boolean" },
          names: { type: "object" },
          parameters: { type: "boolean" },
          properties: { type: "boolean" },
          strict: { type: "boolean" },
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
    const { esTreeNodeToTSNodeMap } = getParserServices(context);
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
        }
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
        }
      );
    } else {
      types.push({
        regExp: /^EventEmitter$/,
        validate: false,
      });
    }

    function checkNode(nameNode: es.Node, typeNode?: es.Node) {
      let tsNode = esTreeNodeToTSNodeMap.get(nameNode);
      const text = tsNode.getText();
      const hasFinnish = /\$$/.test(text);
      if (hasFinnish && !strict) {
        return;
      }
      const shouldBeFinnish = hasFinnish
        ? () => {}
        : () =>
            context.report({
              loc: getLoc(tsNode),
              messageId: "shouldBeFinnish",
            });
      const shouldNotBeFinnish = hasFinnish
        ? () =>
            context.report({
              loc: getLoc(tsNode),
              messageId: "shouldNotBeFinnish",
            })
        : () => {};
      if (
        couldBeObservable(typeNode || nameNode) ||
        couldReturnObservable(typeNode || nameNode)
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
            (couldBeType(typeNode || nameNode, regExp) ||
              couldReturnType(typeNode || nameNode, regExp)) &&
            !validate
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
      "PropertyDefinition[computed=false]": (node: es.PropertyDefinition) => {
        if (validate.properties) {
          checkNode(node.key);
        }
      },
      "FunctionDeclaration > Identifier": (node: es.Identifier) => {
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
      "FunctionExpression > Identifier": (node: es.Identifier) => {
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
      "MethodDefinition[kind='get'][computed=false]": (
        node: es.MethodDefinition
      ) => {
        if (validate.properties) {
          checkNode(node.key, node);
        }
      },
      "MethodDefinition[kind='method'][computed=false]": (
        node: es.MethodDefinition
      ) => {
        if (validate.methods) {
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
        node: es.Identifier
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
      "TSCallSignatureDeclaration > Identifier": (node: es.Identifier) => {
        if (validate.parameters) {
          checkNode(node);
        }
      },
      "TSConstructSignatureDeclaration > Identifier": (node: es.Identifier) => {
        if (validate.parameters) {
          checkNode(node);
        }
      },
      "TSMethodSignature[computed=false]": (node: es.TSMethodSignature) => {
        if (validate.methods) {
          checkNode(node.key, node);
        }
        if (validate.parameters) {
          node.params.forEach((param: es.Node) => checkNode(param));
        }
      },
      "TSParameterProperty > Identifier": (node: es.Identifier) => {
        if (validate.parameters || validate.properties) {
          checkNode(node);
        }
      },
      "TSPropertySignature[computed=false]": (node: es.TSPropertySignature) => {
        if (validate.properties) {
          checkNode(node.key);
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
