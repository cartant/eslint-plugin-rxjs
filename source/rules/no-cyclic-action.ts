/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { stripIndent } from "common-tags";
import { getTypeServices, isCallExpression, isIdentifier } from "eslint-etc";
import ts from "typescript";
import { defaultObservable } from "../constants";
import { ruleCreator } from "../utils";

function getTypeArguments(type: ts.Type): ts.Type[] {
  return type.aliasTypeArguments || (type as any).typeArguments || [];
}

function getActionTypes(type: ts.Type, typeChecker: ts.TypeChecker): string[] {
  if (type.isUnion()) {
    const memberActionTypes: string[] = [];
    for (const memberType of type.types) {
      memberActionTypes.push(...getActionTypes(memberType, typeChecker));
    }
    return memberActionTypes;
  }
  const symbol: any = typeChecker.getPropertyOfType(type, "type");
  if (symbol?.type) {
    return [typeChecker.typeToString(symbol.type)];
  }
  if (symbol?.mapper?.target) {
    return [typeChecker.typeToString(symbol.mapper.target)];
  }
  return [];
}

const defaultOptions: {
  observable?: string;
}[] = [];

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Possible Errors",
      description: "Forbids effects and epics that re-emit filtered actions.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden:
        "Effects and epics that re-emit filtered actions are forbidden.",
    },
    schema: [
      {
        properties: {
          observable: { type: "string" },
        },
        type: "object",
        description: stripIndent`
          An optional object with an optional \`observable\` property.
          The property can be specified as a regular expression string and is used to identify the action observables from which effects and epics are composed.`,
      },
    ],
    type: "problem",
  },
  name: "no-cyclic-action",
  create: (context, unused: typeof defaultOptions) => {
    const [config = {}] = context.options;
    const { observable = defaultObservable } = config;
    const observableRegExp = new RegExp(observable);

    const { getType, typeChecker } = getTypeServices(context);

    function checkNode(pipeCallExpression: es.CallExpression) {
      const args = pipeCallExpression.arguments;
      const ofTypeCallExpression = args.find(
        (arg) =>
          isCallExpression(arg) &&
          isIdentifier(arg.callee) &&
          arg.callee.name === "ofType"
      );
      if (!ofTypeCallExpression) {
        return;
      }
      const pipeType = getType(pipeCallExpression);
      const [pipeElementType] = getTypeArguments(pipeType);
      if (!pipeElementType) {
        return;
      }

      const operatorType = getType(ofTypeCallExpression);
      const [signature] = typeChecker.getSignaturesOfType(
        operatorType,
        ts.SignatureKind.Call
      );
      if (!signature) {
        return;
      }
      const operatorReturnType = typeChecker.getReturnTypeOfSignature(
        signature
      );
      const [operatorElementType] = getTypeArguments(operatorReturnType);
      if (!operatorElementType) {
        return;
      }

      const pipeActionTypes = getActionTypes(pipeElementType, typeChecker);
      const operatorActionTypes = getActionTypes(
        operatorElementType,
        typeChecker
      );

      for (const actionType of operatorActionTypes) {
        if (pipeActionTypes.includes(actionType)) {
          context.report({
            messageId: "forbidden",
            node: pipeCallExpression.callee,
          });
          return;
        }
      }
    }

    return {
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]`]: checkNode,
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]`]: checkNode,
    };
  },
});

export = rule;
