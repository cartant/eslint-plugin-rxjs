/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { getParent } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description:
        "Disallows using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Ignoring the buffer size is forbidden."
    },
    schema: []
  },
  create: context => {
    function report(
      node: es.Node,
      { arguments: args }: { arguments: es.Node[] }
    ) {
      if (!args || args.length === 0) {
        context.report({
          messageId: "forbidden",
          node
        });
      }
    }

    return {
      "NewExpression > Identifier[name='ReplaySubject']": (
        node: es.Identifier
      ) => {
        const newExpression = getParent(node) as es.NewExpression;
        report(node, newExpression);
      },
      "NewExpression > MemberExpression > Identifier[name='ReplaySubject']": (
        node: es.Identifier
      ) => {
        const memberExpression = getParent(node) as es.MemberExpression;
        const newExpression = getParent(memberExpression) as es.NewExpression;
        report(node, newExpression);
      },
      "CallExpression > Identifier[name=/^(publishReplay|shareReplay)$/]": (
        node: es.Identifier
      ) => {
        const callExpression = getParent(node) as es.CallExpression;
        report(node, callExpression);
      }
    };
  }
};

export = rule;
