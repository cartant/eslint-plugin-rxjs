/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Forbids the calling of `subscribe` without specifying arguments.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Calling subscribe without arguments is forbidden."
    },
    schema: []
  },
  create: context => {
    const { couldBeObservable } = typecheck(context);

    return {
      "CallExpression:has([arguments.length = 0]) > MemberExpression[property.name='subscribe']": (
        node: es.MemberExpression
      ) => {
        if (couldBeObservable(node.object)) {
          context.report({
            messageId: "forbidden",
            node: node.property
          });
        }
      }
    };
  }
};

export = rule;
