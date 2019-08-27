/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import {
  couldBeFunction as couldBeFunctionTS,
  couldBeType as couldBeTypeTS,
  isAny as isAnyTS,
  isReferenceType as isReferenceTypeTS
} from "tsutils-etc";
import * as ts from "typescript";

function getParserServices(
  context: Rule.RuleContext
): {
  esTreeNodeToTSNodeMap: Map<es.Node, ts.Node>;
  program: ts.Program;
} {
  if (
    !context.parserServices ||
    !context.parserServices.program ||
    !context.parserServices.esTreeNodeToTSNodeMap
  ) {
    throw new Error(
      "This rule requires you to use `@typescript-eslint/parser` and to specify a `project` in `parserOptions`."
    );
  }
  return context.parserServices;
}

export function typecheck(context: Rule.RuleContext) {
  const service = getParserServices(context);
  const nodeMap = service.esTreeNodeToTSNodeMap;
  const typeChecker = service.program.getTypeChecker();

  const getTSType = (node: es.Node) => {
    const tsNode = nodeMap.get(node);
    const tsType = typeChecker.getTypeAtLocation(tsNode);

    return tsType;
  };

  const couldBeType = (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp }
  ) => {
    const tsType = getTSType(node);

    return couldBeTypeTS(
      tsType,
      name,
      qualified ? { ...qualified, typeChecker } : undefined
    );
  };

  return {
    nodeMap,
    typeChecker,
    getTSType,
    couldBeType,
    couldBeObservable: (node: es.Node) => couldBeType(node, "Observable"),
    couldBeSubscription: (node: es.Node) => couldBeType(node, "Subscription"),
    couldBeSubject: (node: es.Node) => couldBeType(node, "Subject"),
    couldBeBehaviorSubject: (node: es.Node) =>
      couldBeType(node, "BehaviorSubject"),
    couldBeError: (node: es.Node) => couldBeType(node, "Error"),
    couldBeFunction: (node: es.Node) => {
      // Fast check
      if (isArrowFunctionExpression(node) || isFunctionDeclaration(node)) {
        return true;
      }

      // Check with a type checker
      return couldBeFunctionTS(getTSType(node));
    },
    couldBeMonoTypeOperatorFunction: (node: es.Node) =>
      couldBeType(node, "MonoTypeOperatorFunction"),
    isAny: (node: es.Node) => isAnyTS(getTSType(node)),
    isReferenceType: (node: es.Node) => isReferenceTypeTS(getTSType(node))
  };
}

export function getParent(node: es.Node): es.Node {
  return (node as any).parent;
}

export function isCallExpression(node: es.Node): node is es.CallExpression {
  return node.type === "CallExpression";
}

export function isIdentifier(node: es.Node): node is es.Identifier {
  return node.type === "Identifier";
}

export function isMemberExpression(node: es.Node): node is es.MemberExpression {
  return node.type === "MemberExpression";
}

export function isFunctionDeclaration(
  node: es.Node
): node is es.FunctionDeclaration {
  return node.type === "FunctionDeclaration";
}

export function isArrowFunctionExpression(
  node: es.Node
): node is es.ArrowFunctionExpression {
  return node.type === "ArrowFunctionExpression";
}

export function isFunctionExpression(
  node: es.Node
): node is es.FunctionExpression {
  return node.type === "FunctionExpression";
}
