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

function isTypeReference(type: ts.Type): type is ts.TypeReference {
  return Boolean((type as any).target);
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
      if (!isTypeReference(pipeType)) {
        return;
      }
      const [pipeElementType] = typeChecker.getTypeArguments(pipeType);
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
      if (!isTypeReference(operatorReturnType)) {
        return;
      }
      const [operatorElementType] = typeChecker.getTypeArguments(
        operatorReturnType
      );
      if (!operatorElementType) {
        return;
      }

      const pipeActionTypes = getActionTypes(pipeElementType);
      const operatorActionTypes = getActionTypes(operatorElementType);

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

    function getActionTypes(type: ts.Type): string[] {
      if (type.isUnion()) {
        const memberActionTypes: string[] = [];
        for (const memberType of type.types) {
          memberActionTypes.push(...getActionTypes(memberType));
        }
        return memberActionTypes;
      }
      const symbol = typeChecker.getPropertyOfType(type, "type");
      const actionType = typeChecker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration
      );
      return [typeChecker.typeToString(actionType)];
    }

    return {
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]`]: checkNode,
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]`]: checkNode,
    };
  },
});

export = rule;
