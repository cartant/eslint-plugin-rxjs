/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import esquery from "esquery";
import * as es from "estree";
import { getParent, typecheck } from "../utils";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Enforces the use of a `just` alias for `of`.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "Use just alias."
    },
    schema: []
  },
  create: context => {
    const { couldBeObservable } = typecheck(context);

    return {
      "ImportDeclaration[source.value='rxjs'] > ImportSpecifier[imported.name='of']": (
        node: es.ImportSpecifier
      ) => {
        const { loc } = node;
        context.report({
          messageId: "forbidden",
          loc: {
            ...loc,
            end: {
              ...loc.start,
              column: loc.start.column + 2
            }
          }
        });

        const ofIdentifiers = esquery(
          context.getSourceCode().ast,
          "CallExpression > Identifier[name='of']"
        ) as es.Identifier[];
        ofIdentifiers.forEach(ofIdentifier => {
          const callExpression = getParent(ofIdentifier);
          if (couldBeObservable(callExpression)) {
            context.report({
              messageId: "forbidden",
              node: ofIdentifier
            });
          }
        });
      }
    };
  }
};

export = rule;
