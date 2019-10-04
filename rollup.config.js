import typescript from "rollup-plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "./src/tsc/Editor.ts",
  output: {
    format: "iife",
    file: "demo/js/brickyeditor.js",
    name: "BrickyEditor"
  },
  plugins: [
    typescript({
      target: "es5"
    }),
    uglify()
  ]
};
