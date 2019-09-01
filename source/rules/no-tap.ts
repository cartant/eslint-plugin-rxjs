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
      description: "Forbids the use of the tap operator.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "The `tap` operator is forbidden."
    },
    schema: []
  },
  create: context => {
    return {
      "ImportDeclaration[source.value='rxjs/operators'] > ImportSpecifier[imported.name='tap']": (
        node: es.ImportSpecifier
      ) => {
        const { loc } = node;
        context.report({
          messageId: "forbidden",
          loc: {
            ...loc,
            end: {
              ...loc.start,
              column: loc.start.column + 3
            }
          }
        });
      }
    };
  }
};

export = rule;
