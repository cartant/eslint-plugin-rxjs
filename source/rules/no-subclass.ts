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
      description: "Disallows subclassing RxJS classes.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Subclassing RxJS classes is forbidden."
    },
    schema: []
  },
  create: context => {
    const { couldBeType } = typecheck(context);

    const queryNames = [
      "AsyncSubject",
      "BehaviorSubject",
      "Observable",
      "ReplaySubject",
      "Scheduler",
      "Subject",
      "Subscriber"
    ];

    return {
      [`ClassDeclaration[superClass.name=/^(${queryNames.join(
        "|"
      )})$/] > Identifier.superClass`]: (node: es.Identifier) => {
        if (
          queryNames.some(name =>
            couldBeType(node, name, { name: /[\/\\]rxjs[\/\\]/ })
          )
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
