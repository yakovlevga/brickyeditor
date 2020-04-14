const en = {
  "embed.link.title": "Link to embed media",
  "embed.link.placeholder": "Link to instagram, youtube and etc.",
  "image.link.title": "Image link",
  "image.link.placeholder": "http://url-to-image.png",
  "image.upload.title": "or Upload a file",
  "image.upload.placeholder": "select file",
  "image.upload.button": "Select file",
  "image.alt.title": "Alt",
  "image.alt.placeholder": "Image 'alt' attribute value",
  "image.url.subtitle": "Link to open on image click",
  "link.url.title": "Url",
  "link.url.placeholder": "http://put-your-link.here",
  "link.title.title": "Title",
  "link.title.placeholder": "Title attribute for link",
  "link.target.title": "Target",
  "button.close": "close",
  "button.ok": "Ok",
  "button.cancel": "Cancel",
  "templates.group.name.default": "Other templates",
  "error.blocksFileNotFound": "Blocks file not found. Requested file: {url}.",
  "error.templatesFileNotFound": "Templates file not found. Requested file: {url}.",
  "error.blockTemplateNotFound": "Template '{templateName}' not found.",
  "error.templateParsing": "Template parsing error: {name}."
};

export const initDefaultLocale = () => {
  window.BrickyEditor = window.BrickyEditor || {};
  window.BrickyEditor.i18n = window.BrickyEditor.i18n || {};
  window.BrickyEditor.i18n.messages = window.BrickyEditor.i18n.messages || {};
  window.BrickyEditor.i18n.messages.en = en
;
  window.BrickyEditor.i18n.locale = 'en';
  window.BrickyEditor.i18n.default = 'en';

};

export type Locale = Record<keyof typeof en, string>;

export type defaultLocale = 'en'