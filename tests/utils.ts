/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { RuleTester } from "eslint";
import { join } from "path";

export function ruleTester({ types }: { types: boolean }) {
  return new RuleTester({
    parser: join(__dirname, "../node_modules/@typescript-eslint/parser"),
    parserOptions: {
      ecmaVersion: 6,
      project: types ? join(__dirname, "./tsconfig.json") : undefined,
      sourceType: "module"
    }
  });
}
