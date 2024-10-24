// Final Rollup configuration example
import conf from '../../rollup.config.js';
import pkg from './package.json' with { type: "json" };

export default {
    ...conf,
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            sourcemap: true,
            format: 'cjs'
        },
        {
            file: pkg.module,
            sourcemap: true,
            format: 'es'
        }
    ],
    external: ['aurelia', '@aurelia/fetch-client', '@aurelia/router', '@aurelia/validation']
};