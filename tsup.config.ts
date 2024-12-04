import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  clean: true,
  dts: true,
  cjsInterop: true,
  splitting: true,
  format: ['cjs', 'esm'],
});
