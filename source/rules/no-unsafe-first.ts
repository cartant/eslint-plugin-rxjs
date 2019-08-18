/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { Rule } from "eslint";
import * as es from "estree";
import { isCallExpression, isIdentifier, typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows unsafe first/take usage in Effects and epics.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden:
        "Unsafe `first` and `take` usage in Effects and epics are forbidden."
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
    const defaultObservable = "action(s|\\$)?";
    const invalidOperatorsRegExp = /^(take|first)$/;

    const [config] = context.options;
    const { observable = defaultObservable } = config || {};
    const observableRegExp = new RegExp(observable);

    const { couldBeObservable, isReferenceType } = typecheck(context);

    function report(node: es.CallExpression) {
      if (
        !isReferenceType(node) ||
        !couldBeObservable(node) ||
        !node.arguments
      ) {
        return;
      }

      node.arguments.forEach(arg => {
        if (isCallExpression(arg) && isIdentifier(arg.callee)) {
          if (invalidOperatorsRegExp.test(arg.callee.name)) {
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
