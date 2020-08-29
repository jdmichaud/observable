import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [{
    name: 'Observable',
    file: 'dist/index.esm.js',
    format: 'esm',
    sourcemap: true,
  }, {
    name: 'Observable',
    file: 'dist/index.umd.js',
    format: 'umd',
    sourcemap: true,
  }],
  plugins: [
    sourcemaps(),
    typescript(),
  ],
};
