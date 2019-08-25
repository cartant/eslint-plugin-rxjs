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
      description: "Disallows the calling of Observable.create.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Observable.create is forbidden; use new Observable."
    },
    schema: []
  },
  create: context => {
    const { couldBeObservable } = typecheck(context);

    return {
      "CallExpression > MemberExpression[object.name='Observable'] > Identifier[name='create']": (
        node: es.Identifier
      ) => {
        const memberExpression = getParent(node) as es.MemberExpression;
        if (couldBeObservable(memberExpression.object)) {
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
