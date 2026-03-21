import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: true,
  format: 'esm',
  exports: true,
  publint: 'ci-only',
  attw: { enabled: 'ci-only', profile: 'esm-only' },
});
