const path = require("path");
const fs = require("fs");
const nodeSass = require("node-sass");
const postcss = require("postcss");
const parser = require("postcss-selector-parser");
const autoprefixer = require("autoprefixer");

const cssPath = "demo/js/brickyeditor.css";

const processor = postcss([autoprefixer]);

function fromDir(startPath, filter, callback) {
  //console.log('Starting from dir '+startPath+'/');

  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var pathname = path.join(startPath, files[i]);
    var stat = fs.lstatSync(pathname);
    if (stat.isDirectory()) {
      fromDir(pathname, filter, callback); //recurse
    } else if (filter.test(pathname)) {
      callback(pathname, files[i]);
    }
  }
}

let resultCss = "";

fromDir("src/tsc", /\.scss$/, (pathname, file) => {
  console.log("-- found: ", pathname);

  const { css } = nodeSass.renderSync({
    file: pathname
  });

  const result = processor.process(css);
  const { root } = result;

  const rules = root.nodes
    .filter(n => n.type === "rule")
    .filter(n => n.selector.indexOf(".") === 0)
    .map(n => `"${n.selector.substr(1)}"`);

  const typeName = `${file[0].toUpperCase()}${
    file.substr(1).split(".")[0]
  }Styles`;

  const rulesTypings =
    rules.length > 1
      ? `\n${rules.map(r => `  | ${r}`).join("\n")}`
      : " " + rules[0];
  const dts = `export type ${typeName} =${rulesTypings};`;

  fs.writeFileSync(`${pathname}.d.ts`, dts, {
    encoding: "utf8"
  });

  resultCss += "\n" + result.css;

  // result.root //=> AST after plugins (after plugins have transformed all nodes and before nodes have been stringified)
  // result.css //=> CSS string after plugins
});

fs.writeFileSync(cssPath, resultCss, {
  encoding: "utf8"
});
