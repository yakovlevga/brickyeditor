const path = require("path");
const fs = require("fs");
const nodeSass = require("node-sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

const cssPath = "demo/js/brickyeditor.css";
const typingsPath = "src/tsc/types/styles.d.ts";

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
let resultTypings = "declare type BreStyles =";

fromDir("src/tsc", /\.scss$/, (pathname, file) => {
  console.log("-- found: ", pathname);

  const { css } = nodeSass.renderSync({
    file: pathname
  });

  const result = processor.process(css);
  const { root } = result;

  console.log({ nodes: root.nodes.map(n => n.selector) });

  const rules = root.nodes
    .filter(n => n.type === "rule")
    .filter(n => n.selector.indexOf(".") === 0)
    .filter(n => n.selector.indexOf(":") === -1)
    .map(n => n.selector.split(" ")[0])
    .map(n => `"${n.substr(1)}"`);

  if (rules && rules.length > 0) {
    resultTypings += `\n${rules.map(r => renderRule(r)).join("\n")}`;
  }

  if (result && result.css) {
    resultCss += "\n" + result.css;
  }
});

function renderRule(rule) {
  return `  | ${rule}`;
}

resultTypings += ";";

fs.writeFileSync(typingsPath, resultTypings, {
  encoding: "utf8"
});

fs.writeFileSync(cssPath, resultCss, {
  encoding: "utf8"
});
