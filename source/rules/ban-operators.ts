/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { stripIndent } from "common-tags";
import { ruleCreator } from "../utils";

const defaultOptions: Record<string, boolean | string>[] = [];

const rule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      category: "Best Practices",
      description: "Forbids the use of banned operators.",
      recommended: false,
    },
    fixable: undefined,
    messages: {
      forbidden: "RxJS operator is banned: {{name}}{{explanation}}.",
    },
    schema: [
      {
        type: "object",
        description: stripIndent`
          An object containing keys that are names of operators
          and values that are either booleans or strings containing the explanation for the ban.`,
      },
    ],
    type: "problem",
  },
  name: "ban-operators",
  create: (context, unused: typeof defaultOptions) => {
    let bans: { explanation: string; regExp: RegExp }[] = [];

    const [config] = context.options;
    if (!config) {
      return {};
    }

    Object.entries(config).forEach(([key, value]) => {
      if (value !== false) {
        bans.push({
          explanation: typeof value === "string" ? value : "",
          regExp: new RegExp(`^${key}$`),
        });
      }
    });

    function getFailure(name: string) {
      for (let b = 0, length = bans.length; b < length; ++b) {
        const ban = bans[b];
        if (ban.regExp.test(name)) {
          const explanation = ban.explanation ? `: ${ban.explanation}` : "";
          return {
            messageId: "forbidden",
            data: { name, explanation },
          } as const;
        }
      }
      return undefined;
    }

    return {
      "ImportDeclaration[source.value='rxjs/operators'] > ImportSpecifier": (
        node: es.ImportSpecifier
      ) => {
        const identifier = node.imported;
        const failure = getFailure(identifier.name);
        if (failure) {
          context.report({
            ...failure,
            node: identifier,
          });
        }
      },
    };
  },
});

export = rule;
