/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows passing Boolean as a predicate or projector.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Using Boolean as a predicate or projector is forbidden."
    },
    schema: []
  },
  create: context => ({
    "CallExpression[callee.property.name='pipe'] > CallExpression[callee.name=/^(filter|find|first|last)$/][arguments.0.name='Boolean']": ({
      arguments: [node]
    }: es.CallExpression) => {
      context.report({
        messageId: "forbidden",
        node
      });
    }
  })
};

export = rule;
