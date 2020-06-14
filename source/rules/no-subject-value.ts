/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getParent, getTypeServices } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description:
        "Forbids accessing the `value` property of a `BehaviorSubject` instance.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden:
        "Accessing the value property of a BehaviorSubject is forbidden.",
    },
    schema: null,
    type: "problem",
  },
  name: "no-subject-value",
  create: (context) => {
    const { couldBeBehaviorSubject } = getTypeServices(context);

    return {
      "Identifier[name=/^(value|getValue)$/]": (node: es.Identifier) => {
        const parent = getParent(node);

        if (!("object" in parent)) {
          return;
        }

        if (couldBeBehaviorSubject(parent.object)) {
          context.report({
            messageId: "forbidden",
            node,
          });
        }
      },
    };
  },
});

export = rule;
