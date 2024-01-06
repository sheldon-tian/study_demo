import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

let defaults = { compilerOptions: { declaration: true } };
let override = { compilerOptions: { declaration: false } };

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/bundle.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve({ preferBuiltins: true, mainFields: ['browser'] }),
    commonjs(),
    json(),
    typescript({
      tsconfigDefaults: defaults,
      tsconfig: "tsconfig.json",
      tsconfigOverride: override
    }),
  ],
};