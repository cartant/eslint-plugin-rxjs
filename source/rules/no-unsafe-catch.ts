/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { Rule } from "eslint";
import * as es from "estree";
import { defaultObservable } from "../constants";
import {
  isArrowFunctionExpression,
  isCallExpression,
  isFunctionDeclaration,
  isIdentifier,
  typecheck
} from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Forbids unsafe catchError usage in effects and epics.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Unsafe `catchError` usage in effects and epics are forbidden."
    },
    schema: [
      {
        properties: {
          observable: { type: "string" }
        },
        type: "object",
        description: stripIndent`
          An optional object with an optional \`observable\` property.
          The property can be specified as a regular expression string and is used to identify the action observables from which effects and epics are composed.`
      }
    ]
  },
  create: context => {
    const invalidOperatorsRegExp = /^(catchError)$/;

    const [config] = context.options;
    const { observable = defaultObservable } = config || {};
    const observableRegExp = new RegExp(observable);

    const { couldBeObservable, isReferenceType } = typecheck(context);

    function isUnsafe([arg]: es.Node[]) {
      if (
        arg &&
        (isFunctionDeclaration(arg) || isArrowFunctionExpression(arg))
      ) {
        // It's only unsafe if it receives a single function argument. If the
        // source argument is received, assume that it's used to effect a
        // resubscription to the source and that the effect won't complete.
        return arg.params.length < 2;
      }

      return false;
    }

    function report(node: es.CallExpression) {
      if (
        !node.arguments ||
        !isReferenceType(node) ||
        !couldBeObservable(node)
      ) {
        return;
      }

      node.arguments.forEach(arg => {
        if (isCallExpression(arg) && isIdentifier(arg.callee)) {
          if (
            invalidOperatorsRegExp.test(arg.callee.name) &&
            isUnsafe(arg.arguments)
          ) {
            context.report({
              messageId: "forbidden",
              node: arg.callee
            });
          }
        }
      });
    }

    return {
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]`]: report,
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]`]: report
    };
  }
};

export = rule;
