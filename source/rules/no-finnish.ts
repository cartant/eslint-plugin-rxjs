/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { getParent, typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Forbids the use of Finnish notation.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Finnish notation is forbidden."
    },
    schema: []
  },
  create: context => {
    const { couldBeObservable, couldReturnObservable } = typecheck(context);

    function reportIfObservable(typeNode: es.Node, reportNode: es.Node) {
      if (couldBeObservable(typeNode) || couldReturnObservable(typeNode)) {
        context.report({ messageId: "forbidden", node: reportNode });
      }
    }

    return {
      "VariableDeclarator[id.name=/[$]+$/]": (node: es.VariableDeclarator) =>
        reportIfObservable(node.init || node, node.id),
      "ObjectExpression > Property[computed=false][key.name=/[$]+$/]": (
        node: es.Property
      ) => reportIfObservable(node.key, node.key),
      "ObjectPattern > Property[shorthand=true][key.name=/[$]+$/]": (
        node: es.Property
      ) => reportIfObservable(node.key, node.key),
      "ObjectPattern > Property[shorthand=false][value.name=/[$]+$/]": (
        node: es.Property
      ) => reportIfObservable(node.value, node.value),
      "ArrayPattern > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        reportIfObservable(node, node),
      "FunctionExpression > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        reportIfObservable(node, node),
      "ArrowFunctionExpression > Identifier[name=/[$]+$/]": (
        node: es.Identifier
      ) => {
        const parent = getParent(node) as es.ArrowFunctionExpression;
        if (node === parent.body) {
          return false;
        }
        return reportIfObservable(node, node);
      },
      "FunctionDeclaration > Identifier[name=/[$]+$/]": (node: es.Identifier) =>
        reportIfObservable(getParent(node), node),
      "ClassProperty[key.name=/[$]+$/] > Identifier": (node: es.Identifier) =>
        reportIfObservable(getParent(node), node),
      "MethodDefinition[key.name=/[$]+$/]": (node: es.MethodDefinition) =>
        reportIfObservable(node, node.key),
      "TSInterfaceDeclaration > TSInterfaceBody > TSPropertySignature > Identifier[name=/[$]+$/]": (
        node: es.Identifier
      ) => reportIfObservable(getParent(node), node),
      "TSInterfaceDeclaration > TSInterfaceBody > TSMethodSignature > Identifier[name=/[$]+$/]": (
        node: es.Identifier
      ) => reportIfObservable(getParent(node), node)
    };
  }
};

export = rule;
