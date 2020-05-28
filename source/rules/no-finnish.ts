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

    function checkNode(typeNode: es.Node, nameNode: es.Node) {
      if (couldBeObservable(typeNode) || couldReturnObservable(typeNode)) {
        const tsNode = nodeMap.get(nameNode);
        context.report({
          loc: getLoc(tsNode),
          messageId: "forbidden",
        });
      }
    }

    return {
      "ArrayPattern > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        checkNode(node, node),
      "ArrowFunctionExpression > Identifier[name=/[$]+$/]": (
        node: es.Identifier
      ) => {
        const parent = getParent(node) as es.ArrowFunctionExpression;
        if (node !== parent.body) {
          checkNode(node, node);
        }
      },
      "ClassProperty[key.name=/[$]+$/] > Identifier": (node: es.Identifier) =>
        checkNode(getParent(node), node),
      "FunctionDeclaration > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        checkNode(getParent(node), node),
      "FunctionExpression > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        checkNode(node, node),
      "MethodDefinition[key.name=/[$]+$/]": (node: es.MethodDefinition) =>
        checkNode(node, node.key),
      "ObjectExpression > Property[computed=false][key.name=/[$]+$/]": (
        node: es.Property
      ) => checkNode(node.key, node.key),
      "ObjectPattern > Property[shorthand=true][key.name=/[$]+$/]": (
        node: es.Property
      ) => checkNode(node.key, node.key),
      "ObjectPattern > Property[shorthand=false][value.name=/[$]+$/]": (
        node: es.Property
      ) => checkNode(node.value, node.value),
      "TSPropertySignature > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        checkNode(getParent(node), node),
      "TSMethodSignature > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        checkNode(getParent(node), node),
      "VariableDeclarator[id.name=/[$]+$/]": (node: es.VariableDeclarator) =>
        checkNode(node.init || node, node.id),
    };
  },
};

export = rule;
