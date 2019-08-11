/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
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

export function getTypeCheckerAndNodeMap(context: Rule.RuleContext) {
  const service = getParserServices(context);
  const nodeMap = service.esTreeNodeToTSNodeMap;
  const typeChecker = service.program.getTypeChecker();

  return {
    nodeMap,
    typeChecker
  };
}

export function getParent(node: es.Node): es.Node {
  return (node as any).parent;
}

export function isCallExpression(node: es.Node): node is es.CallExpression {
  return node.type === "CallExpression";
}

export function isMemberExpression(node: es.Node): node is es.MemberExpression {
  return node.type === "MemberExpression";
}
