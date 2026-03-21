import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['cli/index.ts'],
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  format: 'esm',
});
