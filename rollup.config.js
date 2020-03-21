import typescript from "rollup-plugin-typescript";
import browsersync from "rollup-plugin-browsersync";

export default {
  input: "./src/tsc/editor.ts",
  output: {
    format: "iife",
    file: "demo/js/brickyeditor.js",
    name: "BrickyEditor"
  },
  plugins: [
    typescript({
      target: "es5",
      declaration: true
    }),

    // uglify(),
    browsersync({
      https: true,
      server: {
        baseDir: "./demo"
      }
    })
  ]
};
