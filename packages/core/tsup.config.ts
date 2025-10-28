import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  splitting: false,
  outDir: 'dist',
  external: ['postcss', 'path', 'fs'],
  noExternal: [],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.mjs',
    };
  },
  // Ensure proper ESM/CJS output
  target: 'es2020',
  platform: 'neutral',
  shims: true,
  cjsInterop: true,
});
