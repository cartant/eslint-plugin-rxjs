/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    deprecated: true,
    docs: {
      category: "Best Practices",
      description: "Forbids the use of the `tap` operator.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "The tap operator is forbidden.",
    },
    replacedBy: ["ban-operators"],
    schema: [],
    type: "problem",
  },
  name: "no-tap",
  create: (context) => {
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
              column: loc.start.column + 3,
            },
          },
        });
      },
    };
  },
});

export = rule;
