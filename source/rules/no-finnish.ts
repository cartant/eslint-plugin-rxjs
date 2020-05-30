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
      description: "Forbids the use of Finnish notation.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Finnish notation is forbidden.",
    },
    schema: [],
  },
  create: (context) => {
    const { couldBeObservable, couldReturnObservable, nodeMap } = typecheck(
      context
    );

    function checkNode(nameNode: es.Node, typeNode?: es.Node) {
      if (
        couldBeObservable(typeNode || nameNode) ||
        couldReturnObservable(typeNode || nameNode)
      ) {
        const tsNode = nodeMap.get(nameNode);
        if (/[$]+$/.test(tsNode.getText())) {
          context.report({
            loc: getLoc(tsNode),
            messageId: "forbidden",
          });
        }
      }
    }

    return {
      "ArrayPattern > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        checkNode(node),
      "ArrowFunctionExpression > Identifier[name=/[$]+$/]": (
        node: es.Identifier
      ) => {
        const parent = getParent(node) as es.ArrowFunctionExpression;
        if (node !== parent.body) {
          checkNode(node);
        }
      },
      "ClassProperty[key.name=/[$]+$/] > Identifier": (node: es.Identifier) =>
        checkNode(node, getParent(node)),
      "FunctionDeclaration > Identifier[name=/[$]+$/]": (
        node: es.Identifier
      ) => {
        const parent = getParent(node) as es.FunctionDeclaration;
        if (node === parent.id) {
          checkNode(node, parent);
        } else {
          checkNode(node);
        }
      },
      "FunctionExpression > Identifier[name=/[$]+$/]": (
        node: es.Identifier
      ) => {
        const parent = getParent(node) as es.FunctionExpression;
        if (node === parent.id) {
          checkNode(node, parent);
        } else {
          checkNode(node);
        }
      },
      "MethodDefinition[key.name=/[$]+$/]": (node: es.MethodDefinition) =>
        checkNode(node.key, node),
      "ObjectExpression > Property[computed=false][key.name=/[$]+$/]": (
        node: es.Property
      ) => checkNode(node.key),
      "ObjectPattern > Property[value.name=/[$]+$/]": (node: es.Property) =>
        checkNode(node.value),
      "TSCallSignatureDeclaration > Identifier[name=/[$]+$/]": (
        node: es.Node
      ) => checkNode(node),
      "TSConstructSignatureDeclaration > Identifier[name=/[$]+$/]": (
        node: es.Node
      ) => checkNode(node),
      "TSParameterProperty > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        checkNode(node),
      "TSPropertySignature > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        checkNode(node, getParent(node)),
      "TSMethodSignature > Identifier[name=/[$]+$/]": (node: es.Identifier) => {
        const parent = getParent(node) as any;
        if (node === parent.key) {
          checkNode(node, parent);
        } else {
          checkNode(node);
        }
      },
      "VariableDeclarator[id.name=/[$]+$/]": (node: es.VariableDeclarator) =>
        checkNode(node.id, node.init || node),
    };
  },
};

export = rule;
