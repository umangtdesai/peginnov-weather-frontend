import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

export default {
  input: {
    'peginnov-app': 'src/peginnov-app.ts',
    'peginnov-navigation': 'src/components/navigation.ts',
    'peginnov-form': 'src/components/form.ts',
    'peginnov-weather-table': 'src/components/weather-table.ts',
    'peginnov-city-display': 'src/components/city-display.ts',
  },
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    terser(), 
    copy({
      targets: [
        { src: 'src/**/*.html', dest: 'dist' }, 
        { src: 'src/**/*.css', dest: 'dist' }, 
        { src: 'src/**/*.yaml', dest: 'dist' },
      ],
    }),
  ],
};
