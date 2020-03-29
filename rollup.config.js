import typescript from "rollup-plugin-typescript";
import browsersync from "rollup-plugin-browsersync";

const ts = typescript({
  target: "es5",
  declaration: true
});

export default [
  // {
  //   input: "./src/plugins/example/example.ts",
  //   output: {
  //     format: "iife",
  //     file: "demo/js/bre-plugin-example.js",
  //     name: "brePluginExample"
  //   },
  //   plugins: [ts]
  // },
  {
    input: "./src/plugins/html-editor/index.ts",
    output: {
      format: "iife",
      file: "demo/js/bre-plugin-html-editor.js",
      name: "brePluginHtmlEditor"
    },
    plugins: [ts]
  },
  {
    input: "./src/tsc/editor.ts",
    output: {
      format: "iife",
      file: "demo/js/brickyeditor.js",
      name: "BrickyEditor"
    },
    plugins: [
      ts,

      // uglify(),
      browsersync({
        https: true,
        server: {
          baseDir: "./demo"
        }
      })
    ]
  }
];
