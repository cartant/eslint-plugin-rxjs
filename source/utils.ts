/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { ESLintUtils } from "@typescript-eslint/experimental-utils";

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

export function escapeRegExp(text: string): string {
  // https://stackoverflow.com/a/3561711/6680611
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export const ruleCreator = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/cartant/eslint-plugin-rxjs/tree/main/docs/rules/${name}.md`
);
