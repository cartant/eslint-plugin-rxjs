/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";
import { getParent, isArrayExpression, isObjectExpression } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Forbids explicit generic type arguments.",
      recommended: true,
    },
    fixable: null,
    messages: {
      forbidden: "Explicit generic type arguments are forbidden.",
    },
    schema: [],
  },
  create: (context) => {
    function report(node: es.Node) {
      context.report({
        messageId: "forbidden",
        node,
      });
    }

    function checkBehaviorSubjects(node: es.Node) {
      const parent = getParent(node) as es.NewExpression;
      const {
        arguments: [value],
      } = parent;
      if (isArrayExpression(value) || isObjectExpression(value)) {
        return;
      }
      report(node);
    }

    function checkNotifications(node: es.Node) {
      const parent = getParent(node) as es.NewExpression;
      const {
        arguments: [, value],
      } = parent;
      if (isArrayExpression(value) || isObjectExpression(value)) {
        return;
      }
      report(node);
    }

    return {
      "CallExpression[callee.property.name='pipe'] > CallExpression[typeParameters.params.length > 0] > Identifier": report,
      "NewExpression[typeParameters.params.length > 0] > Identifier[name='BehaviorSubject']": checkBehaviorSubjects,
      "CallExpression[typeParameters.params.length > 0] > Identifier[name=/^(from|of)$/]": report,
      "NewExpression[typeParameters.params.length > 0][arguments.0.value='N'] > Identifier[name='Notification']": checkNotifications,
    };
  },
};

export = rule;
