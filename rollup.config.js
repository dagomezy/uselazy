import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const noDeclarationFiles = { compilerOptions: { declaration: false } };

export default [
  // ES
  {
    input: 'src/index.tsx',
    output: { file: 'es/useLazy.js', format: 'es', indent: false },
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      commonjs({
        namedExports: {
          react: ['useEffect', 'useState']
        }
      }),
      nodeResolve({
        extensions: ['.tsx'],
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
    ],
  },
  // ES for Browsers
  {
    input: 'src/index.tsx',
    output: { file: 'es/useLazy.mjs', format: 'es', indent: false },
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      commonjs({
        namedExports: {
          react: ['useEffect', 'useState']
        }
      }),
      nodeResolve({
        extensions: ['.tsx'],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
  // UMD Development
  {
    input: 'src/index.tsx',
    output: {
      file: 'dist/useLazy.js',
      format: 'umd',
      name: 'useLazy',
      indent: false,
      globals: {
        react: 'React',
      },
    },
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      commonjs({
        namedExports: {
          react: ['useEffect', 'useState']
        }
      }),
      nodeResolve({
        extensions: ['.tsx']
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  },

  // UMD Production
  {
    input: 'src/index.tsx',
    output: {
      file: 'dist/useLazy.min.js',
      format: 'umd',
      name: 'useLazy',
      indent: false,
      globals: {
        react: 'React',
      },
    },
    
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      commonjs({
        namedExports: {
          react: ['useEffect', 'useState']
        }
      }),
      nodeResolve({
        extensions: ['.tsx'],
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
];