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
      description: "Disallows the use of the tap operator.",
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
        context.report({
          messageId: "forbidden",
          loc: {
            start: node.loc.start,
            end: {
              line: node.loc.start.line,
              column: node.loc.start.column + 3
            }
          }
        });
      }
    };
  }
};

export = rule;
