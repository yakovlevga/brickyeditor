const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const uglify = require('uglify-js');

const defaultLocale = 'en';
const localeFolder = 'src/i18n/';
const tsPath = 'src/tsc/i18n.ts';
const filehound = require('filehound');

function getLocaleFromFile(fileName) {
  const fn = fileName.split(/[\\\/]/).pop();
  return fn.substring(0, fn.lastIndexOf('.'));
}

function generateScript(locale, space = '') {
  var script = space + 'window.BrickyEditor = window.BrickyEditor || {};\n';
  script +=
    space + 'window.BrickyEditor.i18n = window.BrickyEditor.i18n || {};\n';
  script +=
    space +
    'window.BrickyEditor.i18n.messages = window.BrickyEditor.i18n.messages || {};\n';
  script += space + `window.BrickyEditor.i18n.messages.${locale} = ${locale}\n`;

  return script;
}

function toJS(fileName) {
  const locale = getLocaleFromFile(fileName);
  console.log(`Converting i18n file ${fileName} to ${locale}.js`);

  const doc = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));

  var js = '(function() {';
  js += `  var ${locale} = `;
  js += JSON.stringify(doc, null, 4).replace(/};/g, '    };');
  js += ';';
  js += generateScript(locale, '  ');
  js += '})();';

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
  let ts = `const ${locale} = `;
  ts += JSON.stringify(doc, null, 2);
  ts += ';\n\n';
  ts += 'export const initDefaultLocale = () => {\n';
  ts += generateScript(locale, '  ');
  ts += ';\n';
  ts += `  window.BrickyEditor.i18n.locale = '${locale}';\n`;
  ts += `  window.BrickyEditor.i18n.default = '${locale}';\n\n`;
  ts += '};\n\n';

  ts += `export type Locale = Record<keyof typeof ${locale}, string>;\n`;
  ts += '\n';
  ts += `export type defaultLocale = '${locale}'`;

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
