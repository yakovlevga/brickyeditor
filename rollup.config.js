import typescript from 'rollup-plugin-typescript';
import browsersync from 'rollup-plugin-browsersync';
import execute from 'rollup-plugin-execute';
// import { uglify } from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

import extensionMapper from 'rollup-plugin-extension-mapper';

const ts = typescript({
  target: 'es5',
  declaration: true,
});

const getPluginTasks = (name, plugin) => [
  {
    input: './src/scripts/empty.js',
    // output: {
    //   file: './empty-output.js',
    // },
    plugins: [
      execute(
        `node-sass ./src/plugins/${plugin} -o ./src/plugins/${plugin} --source-map true`
      ),
    ],
  },
  {
    input: `./src/plugins/${plugin}/index.ts`,
    output: {
      format: 'iife',
      file: `demo/js/brickyeditor/plugins/bre-plugin-${plugin}.js`,
      name,
    },
    sourceMap: true,
    plugins: [
      extensionMapper({
        '.scss': '.css',
      }),
      ts,
      postcss({}),
      // sass({
      //   insert: true,
      // }),
    ],
  },
];

export default [
  // ...getPluginTasks('brePluginHtmlEditor', 'html-editor'),

  {
    input: './src/tsc/editor.ts',
    output: {
      format: 'iife',
      file: 'demo/js/brickyeditor/brickyeditor.js',
      name: 'BrickyEditor',
    },
    sourceMap: true,
    plugins: [
      execute('node src/scripts/styles.js'),
      // execute('node src/scripts/i18n.js'),
      ts,
      //uglify({}),
      browsersync({
        https: true,
        server: {
          baseDir: './demo',
        },
      }),
    ],
    watch: {
      include: 'src/**/*',
      exclude: ['src/tsc/i18n.default.ts'],
    },
  },
];
