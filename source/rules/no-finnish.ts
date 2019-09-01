/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { couldBeType } from "tsutils-etc";
import * as ts from "typescript";
import { typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows the use of Finnish notation.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Finnish notation is forbidden"
    },
    schema: []
  },
  create: context => {
    const { couldBeObservable } = typecheck(context);

    function isFunctionDeclaration(
      node: es.Node
    ): node is es.FunctionDeclaration {
      return (node as es.FunctionDeclaration).id !== undefined;
    }
    function isMethodDefinition(node: es.Node): node is es.MethodDefinition {
      return (node as es.MethodDefinition).key !== undefined;
    }
    function getTsType(node: es.Node) {
      const { nodeMap, typeChecker } = typecheck(context);
      let tsNode = nodeMap.get(node);

      if (
        ts.isFunctionDeclaration(tsNode) ||
        ts.isMethodDeclaration(tsNode) ||
        ts.isFunctionExpression(tsNode) ||
        ts.isCallSignatureDeclaration(tsNode) ||
        ts.isMethodSignature(tsNode)
      ) {
        tsNode = tsNode.type;
      }

      return typeChecker.getTypeAtLocation(tsNode);
    }

    function isErrorWorthy(node: any): boolean {
      let name;
      if (node.key) {
        name = node.key.name;
      } else {
        name = node.name;
      }

      const tsType = getTsType(node);

      return /\$$/.test(name) && couldBeType(tsType, "Observable");
    }

    function report(
      node: es.Node | es.FunctionDeclaration | es.FunctionExpression
    ) {
      if (couldBeObservable(node)) {
        let reportObject = { messageId: "forbidden", node };

        if (isFunctionDeclaration(node)) {
          const funcId = (node as es.FunctionDeclaration).id;
          reportObject = Object.assign({}, reportObject, { node: funcId });
        }
        if (isMethodDefinition(node)) {
          const funcId = (node as es.MethodDefinition).key;
          reportObject = Object.assign({}, reportObject, { node: funcId });
        }

        context.report(reportObject);
      }
    }

    function reportInterface(node: any) {
      node.body.forEach((signature: any) => {
        if (isErrorWorthy(signature)) {
          context.report({ messageId: "forbidden", node: signature.key });
        }

        if (signature.params) {
          signature.params.forEach((identifier: any) => {
            if (isErrorWorthy(identifier)) {
              context.report({ messageId: "forbidden", node: identifier });
            }
          });
        }
      });
    }

    function reportFunction(
      node: es.FunctionDeclaration | es.MethodDefinition
    ) {
      const tsType = getTsType(node);

      if (couldBeType(tsType, "Observable")) {
        if (isFunctionDeclaration(node)) {
          context.report({
            messageId: "forbidden",
            node: node.id
          });
        } else if (isMethodDefinition(node)) {
          context.report({
            messageId: "forbidden",
            node: node.key
          });
        }
      }
    }

    return {
      "VariableDeclaration > VariableDeclarator[id.name=/[$]+$/]": report,
      "VariableDeclaration > VariableDeclarator > ObjectExpression > Property[computed=false]:has(Identifier[name=/[$]+$/])": report,
      "VariableDeclaration > VariableDeclarator > ObjectPattern > Property[shorthand=true]:has(Identifier[name=/[$]+$/]) > Identifier.key": report,
      "VariableDeclaration > VariableDeclarator > ObjectPattern > Property[shorthand=false]:has(Identifier[name=/[$]+$/]) > Identifier": report,
      "VariableDeclaration > VariableDeclarator > ArrayPattern:has(Identifier[name=/[$]+$/]) > Identifier": report,
      "ExpressionStatement > CallExpression > FunctionExpression:has(Identifier[name=/[$]+$/]) > Identifier": report,
      "ExpressionStatement > CallExpression > ArrowFunctionExpression:has(Identifier[name=/[$]+$/]) > Identifier": report,
      "FunctionDeclaration[id.name=/[$]+$/]": reportFunction,
      "FunctionDeclaration > Identifier[typeAnnotation][name=/[$]+$/]": report,
      "ClassDeclaration > ClassBody > ClassProperty[key.name=/[$]+$/] > Identifier": report,
      "ClassDeclaration > ClassBody > MethodDefinition[key.name='constructor'] > FunctionExpression:has(Identifier[name=/[$]+$/]) > Identifier": report,
      "ClassDeclaration > ClassBody > MethodDefinition:not([kind='method'])[key.name=/[$]+$/] > Identifier": report,
      "ClassDeclaration > ClassBody > MethodDefinition[kind='method'][key.name=/[$]+$/]": reportFunction,
      "ClassDeclaration > ClassBody > MethodDefinition[key.name=/[$]+$/] > FunctionExpression:has(Identifier[name=/[$]+$/]) > Identifier": report,
      "TSInterfaceDeclaration > TSInterfaceBody": reportInterface
    };
  }
};

export = rule;
