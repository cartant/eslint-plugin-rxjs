/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { Rule } from "eslint";
import * as es from "estree";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Disallows the use of banned observables.",
      recommended: false
    },
    fixable: null,
    messages: {
      forbidden: "RxJS observable is banned: {{name}}{{explanation}}."
    },
    schema: [
      {
        type: "object",
        description: stripIndent`
          An object containing keys that are names of observable factory functions
          and values that are either booleans or strings containing the explanation for the ban.`
      }
    ]
  },
  create: context => {
    let bans: { explanation: string; regExp: RegExp }[] = [];

    const [config] = context.options;
    if (!config) {
      return {};
    }

    Object.entries(config).forEach(([key, value]) => {
      if (value !== false) {
        bans.push({
          explanation: typeof value === "string" ? value : "",
          regExp: new RegExp(`^${key}$`, "i")
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
            data: { name, explanation }
          };
        }
      }
      return undefined;
    }

    return {
      "ImportDeclaration[source.value='rxjs'] > ImportSpecifier": (
        node: es.ImportSpecifier
      ) => {
        const identifier = node.imported;
        const failure = getFailure(identifier.name);
        if (failure) {
          context.report({
            ...failure,
            node: identifier
          });
        }
      }
    };
  }
};

export = rule;
