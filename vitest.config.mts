import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
    coverage: {
      reporter: ['text-summary', 'lcovonly'],
      exclude: ['scripts/**', ...coverageConfigDefaults.exclude],
    },
  },
});
