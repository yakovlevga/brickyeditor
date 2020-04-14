const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const uglify = require('uglify-js');

const defaultLocale = 'en';
const localeFolder = 'src/i18n/';
const tsPath = 'src/tsc/i18n.default.ts';
const filehound = require('filehound');

function getLocaleFromFile(fileName) {
  const fn = fileName.split(/[\\\/]/).pop();
  return fn.substring(0, fn.lastIndexOf('.'));
}

function toJS(fileName) {
  const locale = getLocaleFromFile(fileName);
  console.log(`Converting i18n file ${fileName} to ${locale}.js`);

  const doc = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));

  js = `window.BrickyEditor.i18n.messages.${locale} = ${JSON.stringify(doc)}`;
  js = uglify.minify(js).code;

  const filenameJs = localeFolder + locale + '.min.js';
  fs.writeFileSync(filenameJs, js, {
    encoding: 'utf8',
  });
}

function defaultToTS(fileName) {
  const locale = getLocaleFromFile(fileName);
  console.log(`Converting ${fileName} to locale.d.ts`);

  const doc = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
  let ts = `export const defaultLocale = ${JSON.stringify(doc, null, 2)}`;

  fs.writeFileSync(tsPath, ts, {
    encoding: 'utf8',
  });
}

(function execute() {
  const files = filehound
    .create()
    .ext('yaml')
    .paths('./src/locales')
    .findSync();
  console.log(files);

  files.forEach(toJS);

  const defaultLocaleFile = files.find(x =>
    x.endsWith(`${defaultLocale}.yaml`)
  );
  defaultToTS(defaultLocaleFile);
})();
