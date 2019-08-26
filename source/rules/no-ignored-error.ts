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
      description:
        "Disallows the calling of subscribe without specifying an error handler.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Calling subscribe without an error handler is forbidden."
    },
    schema: []
  },
  create: context => {
    const { couldBeObservable, isReferenceType, couldBeFunction } = typecheck(
      context
    );

    return {
      "CallExpression[arguments.length > 0] > MemberExpression > Identifier[name='subscribe']": (
        node: es.Identifier
      ) => {
        const memberExpression = getParent(node) as es.MemberExpression;
        const callExpression = getParent(memberExpression) as es.CallExpression;

        if (
          callExpression.arguments.length < 2 &&
          isReferenceType(memberExpression.object) &&
          couldBeObservable(memberExpression.object) &&
          couldBeFunction(callExpression.arguments[0])
        ) {
          context.report({
            messageId: "forbidden",
            node
          });
        }
      }
    };
  }
};

export = rule;
