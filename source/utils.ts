/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import {
  ESLintUtils,
  TSESLint,
  TSESTree as es,
} from "@typescript-eslint/experimental-utils";
import {
  getParserServices,
  isArrowFunctionExpression,
  isFunctionDeclaration,
} from "eslint-etc";
import * as tsutils from "tsutils-etc";
import * as ts from "typescript";

export function createRegExpForWords(config: string | string[]): RegExp | null {
  if (!config || !config.length) {
    return null;
  }
  const flags = "i";
  if (typeof config === "string") {
    return new RegExp(config, flags);
  }
  const words = config;
  const joined = words.map((word) => String.raw`(\b|_)${word}(\b|_)`).join("|");
  return new RegExp(`(${joined})`, flags);
}

export const ruleCreator = ESLintUtils.RuleCreator(
  (name) => "https://github/cartant/eslint-plugin-rxjs"
);

export function typecheck<
  TMessageIds extends string,
  TOptions extends unknown[]
>(context: TSESLint.RuleContext<TMessageIds, Readonly<TOptions>>) {
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
    isReferenceType: (node: es.Node) =>
      tsutils.isReferenceType(getTSType(node)),
  };
}
