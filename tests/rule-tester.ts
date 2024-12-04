import path from 'node:path';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { parser as tseslintParser } from 'typescript-eslint';
import * as vitest from 'vitest';

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

export function ruleTester({ typeScript = true, types = true, jsx = false } = {}) {
  return new RuleTester({
    languageOptions: {
      parser: typeScript ? tseslintParser : undefined,
      parserOptions: {
        projectService: typeScript && types ? {
          allowDefaultProject: ['*.ts*'],
          defaultProject: 'tsconfig.json',
        } : undefined,
        tsconfigRootDir: path.join(__dirname, '..'),
        ecmaFeatures: {
          jsx,
        },
      },
    },
  });
}
