const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const uglify = require('uglify-js');

const defaultLocale = 'en';
const localeFolder = 'src/i18n/';
const typingsPath = 'src/tsc/types/locale.d.ts';
const filehound = require('filehound');

function getLocaleFromFile(fileName) {
  const fn = fileName.split(/[\\\/]/).pop();
  return fn.substring(0, fn.lastIndexOf('.'));
}

function toJS(fileName) {
  const locale = getLocaleFromFile(fileName);
  console.log(`Converting i18n file ${fileName} to ${locale}.js`);

  const doc = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));

  var js = '(function() {';
  js += `  var ${locale} = `;
  js += JSON.stringify(doc, null, 4).replace(/};/g, '    };');
  js += ';';
  js += '  window.BrickyEditor = window.BrickyEditor || {};';
  js += '  window.BrickyEditor.i18n = window.BrickyEditor.i18n || {};';
  js +=
    '  window.BrickyEditor.i18n.messages = window.BrickyEditor.i18n.messages || {};';
  js += `  window.BrickyEditor.i18n.messages.${locale} = ${locale}`;
  js += '})();';

  js = uglify.minify(js).code;

  const filenameJs = localeFolder + locale + '.min.js';
  fs.writeFileSync(filenameJs, js, {
    encoding: 'utf8',
  });
}

function toDTS(fileName) {
  const locale = getLocaleFromFile(fileName);
  console.log(`Converting ${fileName} to locale.d.ts`);

  const doc = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));

  const keys = Object.keys(doc);

  let dts = 'type BreStrings =\n';
  dts += keys.map(k => `  | "${k}"`).join('\n') + ';\n\n';
  dts += 'export type Locale = Record<BreStrings, string>;\n';
  dts += '\n';
  dts += `export type defaultLocale = '${locale}'`;

  fs.writeFileSync(typingsPath, dts, {
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
  toDTS(defaultLocaleFile);
})();
