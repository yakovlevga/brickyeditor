type BreStrings =
  | "embed.link.title"
  | "embed.link.placeholder"
  | "image.link.title"
  | "image.link.placeholder"
  | "image.upload.title"
  | "image.upload.placeholder"
  | "image.upload.button"
  | "image.alt.title"
  | "image.alt.placeholder"
  | "image.url.subtitle"
  | "link.url.title"
  | "link.url.placeholder"
  | "link.title.title"
  | "link.title.placeholder"
  | "link.target.title"
  | "button.close"
  | "button.ok"
  | "button.cancel"
  | "templates.group.name.default"
  | "error.blocksFileNotFound"
  | "error.templatesFileNotFound"
  | "error.blockTemplateNotFound"
  | "error.templateParsing";

export type Locale = Record<BreStrings, string>;

export type defaultLocale = 'en'