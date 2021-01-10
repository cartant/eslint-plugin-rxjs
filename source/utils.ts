/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { ESLintUtils } from "@typescript-eslint/experimental-utils";

export function createRegExpForWords(config: string | string[]): RegExp | null {
  if (!config || !config.length) {
    return null;
  }
  const flags = "i";
  if (typeof config === "string") {
    return new RegExp(config, flags);
  }
  const words = config;
  const joined = words.map((word) => String.raw`(\b|_)${word}(\b|_)`).join("|");
  return new RegExp(`(${joined})`, flags);
}

export const ruleCreator = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/cartant/eslint-plugin-rxjs/tree/main/docs/rules/${name}.md`
);
