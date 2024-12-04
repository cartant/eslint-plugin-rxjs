import { TSESLint } from '@typescript-eslint/utils';

export const createRecommendedConfig = (
  plugin: TSESLint.FlatConfig.Plugin,
) => ({
  name: 'rxjs-x/recommended' as const,
  plugins: {
    'rxjs-x': plugin,
  },
  rules: {
    'rxjs-x/no-async-subscribe': 'error',
    'rxjs-x/no-create': 'error',
    'rxjs-x/no-ignored-notifier': 'error',
    'rxjs-x/no-ignored-replay-buffer': 'error',
    'rxjs-x/no-ignored-takewhile-value': 'error',
    'rxjs-x/no-implicit-any-catch': 'error',
    'rxjs-x/no-index': 'error',
    'rxjs-x/no-internal': 'error',
    'rxjs-x/no-nested-subscribe': 'error',
    'rxjs-x/no-redundant-notify': 'error',
    'rxjs-x/no-sharereplay': 'error',
    'rxjs-x/no-subject-unsubscribe': 'error',
    'rxjs-x/no-subscribe-in-pipe': 'error',
    'rxjs-x/no-topromise': 'error',
    'rxjs-x/no-unbound-methods': 'error',
    'rxjs-x/no-unsafe-subject-next': 'error',
    'rxjs-x/no-unsafe-takeuntil': 'error',
    'rxjs-x/prefer-observer': 'error',
    'rxjs-x/prefer-root-operators': 'error',
    'rxjs-x/throw-error': 'error',
  },
} satisfies TSESLint.FlatConfig.Config);
