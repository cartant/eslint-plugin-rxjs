/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import * as tsutils from "tsutils-etc";
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
    return tsutils.couldBeType(
      tsType,
      name,
      qualified ? { ...qualified, typeChecker } : undefined
    );
  };

  const couldReturnType = (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp }
  ) => {
    const tsNode = nodeMap.get(node);
    if (
      ts.isArrowFunction(tsNode) ||
      ts.isFunctionDeclaration(tsNode) ||
      ts.isMethodDeclaration(tsNode) ||
      ts.isFunctionExpression(tsNode) ||
      ts.isCallSignatureDeclaration(tsNode) ||
      ts.isMethodSignature(tsNode)
    ) {
      return (
        tsNode.type &&
        tsutils.couldBeType(
          typeChecker.getTypeAtLocation(tsNode.type),
          name,
          qualified ? { ...qualified, typeChecker } : undefined
        )
      );
    }
    return false;
  };

  return {
    nodeMap,
    typeChecker,
    getTSType,
    couldBeType,
    couldReturnType,
    couldBeObservable: (node: es.Node) => couldBeType(node, "Observable"),
    couldReturnObservable: (node: es.Node) =>
      couldReturnType(node, "Observable"),
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
      return tsutils.couldBeFunction(getTSType(node));
    },
    couldBeMonoTypeOperatorFunction: (node: es.Node) =>
      couldBeType(node, "MonoTypeOperatorFunction"),
    isAny: (node: es.Node) => tsutils.isAny(getTSType(node)),
    isReferenceType: (node: es.Node) => tsutils.isReferenceType(getTSType(node))
  };
}

export function getParent(node: es.Node): es.Node {
  return (node as any).parent;
}

export function isArrayExpression(node: es.Node): node is es.ArrayExpression {
  return node.type === "ArrayExpression";
}

export function isObjectExpression(node: es.Node): node is es.ObjectExpression {
  return node.type === "ObjectExpression";
}

export function isBlockStatement(node: es.Node): node is es.BlockStatement {
  return node.type === "BlockStatement";
}

export function isProgram(node: es.Node): node is es.Program {
  return node.type === "Program";
}

export function isCallExpression(node: es.Node): node is es.CallExpression {
  return node.type === "CallExpression";
}

export function isIdentifier(node: es.Node): node is es.Identifier {
  return node.type === "Identifier";
}

export function isLiteral(node: es.Node): node is es.Literal {
  return node.type === "Literal";
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

export function createRegExpForWords(config: string | string[]): RegExp | null {
  if (!config || !config.length) {
    return null;
  }
  const flags = "i";
  if (typeof config === "string") {
    return new RegExp(config, flags);
  }
  const words = config;
  const joined = words.map(word => String.raw`(\b|_)${word}(\b|_)`).join("|");
  return new RegExp(`(${joined})`, flags);
}
