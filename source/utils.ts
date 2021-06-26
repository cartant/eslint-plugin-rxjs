/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { ESLintUtils, TSESLint } from "@typescript-eslint/experimental-utils";

export function createRegExpForWords(
  config: string | string[]
): RegExp | undefined {
  if (!config || !config.length) {
    return undefined;
  }
  const flags = "i";
  if (typeof config === "string") {
    return new RegExp(config, flags);
  }
  const words = config;
  const joined = words.map((word) => String.raw`(\b|_)${word}(\b|_)`).join("|");
  return new RegExp(`(${joined})`, flags);
}

export function isRxJSImport(
  name: string,
  scope: TSESLint.Scope.Scope
): boolean {
  const variable = scope.variables.find((variable) => variable.name === name);
  if (variable) {
    return variable.defs.some(
      (def) =>
        def.type === "ImportBinding" &&
        def.parent.type === "ImportDeclaration" &&
        /^rxjs\/?/.test(def.parent.source.value as string)
    );
  }
  return scope.upper ? isRxJSImport(name, scope.upper) : false;
}

export const ruleCreator = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/cartant/eslint-plugin-rxjs/tree/main/docs/rules/${name}.md`
);
