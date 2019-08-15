/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { RuleTester } from "eslint";
import { join } from "path";

export function ruleTester({ types }: { types: boolean }) {
  const filename = join(__dirname, "file.ts");
  const tester = new RuleTester({
    parser: join(__dirname, "../node_modules/@typescript-eslint/parser"),
    parserOptions: {
      ecmaVersion: 6,
      project: types ? join(__dirname, "./tsconfig.json") : undefined,
      sourceType: "module"
    }
  });
  const run = tester.run;
  tester.run = (name, rule, { invalid = [], valid = [] }) =>
    run.call(tester, name, rule, {
      invalid: invalid.map(test => ({ ...test, filename })),
      valid: valid.map(test =>
        typeof test === "string"
          ? { code: test, filename }
          : { ...test, filename }
      )
    });
  return tester;
}
