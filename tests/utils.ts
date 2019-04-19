/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import path = require("path");

export const configWithoutTypes = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  }
};

export const configWithTypes = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    project: path.join(__dirname, "./tsconfig.json"),
    sourceType: "module"
  }
};

export function lines(...lines: string[]): string {
  return lines.join("\n");
}
