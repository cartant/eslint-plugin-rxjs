// @ts-check
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import gitignore from 'eslint-config-flat-gitignore';
import importX from 'eslint-plugin-import-x';
import n from 'eslint-plugin-n';
import tseslint from 'typescript-eslint';
import vitest from '@vitest/eslint-plugin';
import eslintPlugin from 'eslint-plugin-eslint-plugin';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Config} */
// @ts-expect-error -- eslint-plugin does not provide types.
const eslintPluginConfig = eslintPlugin.configs['flat/recommended'];

export default tseslint.config(gitignore(), {
  files: [
    'src/**/*.ts',
    'tests/**/*.ts',
  ],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    stylistic.configs['disable-legacy'],
    stylistic.configs.customize({
      flat: true,
      quotes: 'single',
      indent: 2,
      semi: true,
      jsx: false,
      braceStyle: '1tbs',
      commaDangle: 'always-multiline',
    }),
    n.configs['flat/recommended-module'],
    importX.flatConfigs.recommended,
    importX.flatConfigs.typescript,
    eslintPluginConfig,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    '@stylistic/arrow-parens': 'off',
    '@stylistic/multiline-ternary': 'off',

    'sort-imports': [
      'warn',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    'import-x/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    'import-x/no-named-as-default-member': 'off',

    'n/no-missing-import': 'off',

    'eslint-plugin/require-meta-docs-description': [
      'error',
      {
        pattern: '^(Enforce|Require|Disallow)',
      },
    ],
    'eslint-plugin/prefer-placeholders': 'error',
    'eslint-plugin/require-meta-schema-description': 'error',

    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowNumber: true,
        allowBoolean: true,
        allowAny: true,
        allowNullish: true,
        allowRegExp: true,
        allowNever: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}, {
  files: [
    'tests/**/*.ts',
  ],
  extends: [
    vitest.configs.recommended,
  ],
});
