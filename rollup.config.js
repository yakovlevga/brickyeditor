import typescript from 'rollup-plugin-typescript';
import browsersync from 'rollup-plugin-browsersync';
import execute from 'rollup-plugin-execute';
import sass from 'rollup-plugin-sass';

const ts = typescript({
  target: 'es5',
  declaration: true,
});

export default [
  {
    input: './src/plugins/html-editor/index.ts',
    output: {
      format: 'iife',
      file: 'demo/js/bre-plugin-html-editor.js',
      name: 'brePluginHtmlEditor',
    },
    plugins: [
      ts,
      sass({
        insert: true,
      }),
    ],
  },

  {
    input: './src/tsc/editor.ts',
    output: {
      format: 'iife',
      file: 'demo/js/brickyeditor/brickyeditor.js',
      name: 'BrickyEditor',
    },
    plugins: [
      execute('node src/scripts/styles.js'),
      execute('node src/scripts/i18n.js'),
      ts,
      // uglify(),
      browsersync({
        https: true,
        server: {
          baseDir: './demo',
        },
      }),
    ],
  },
];
