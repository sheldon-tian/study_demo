import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';


export default {
	input: 'src/index.ts',
	output: {
		file: 'lib/bundle.js',
		format: 'cjs',
	},
    plugins: [
        json(),
        commonjs(),
        resolve(),
        ts({
            tsconfig: 'tsconfig.json',
        })
    ]
};