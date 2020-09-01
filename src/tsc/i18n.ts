import { defaultLocale, defaultLanguage } from '@/i18n.default';

export const i18n = () => {
  window.BrickyEditor = window.BrickyEditor || {};
  window.BrickyEditor.i18n = window.BrickyEditor.i18n || {};
  window.BrickyEditor.i18n.messages = window.BrickyEditor.i18n.messages || {};
  window.BrickyEditor.i18n.default = defaultLanguage;
  window.BrickyEditor.i18n.messages[defaultLanguage] = defaultLocale;
};

export const setLocale = (
  locale: string = window.BrickyEditor.i18n.default
) => {
  // TODO: log error if there is no locale loaded
  if (window.BrickyEditor.i18n.messages[locale] !== undefined) {
    window.BrickyEditor.i18n.locale = locale;
  }
};

export type Locale = Record<keyof typeof defaultLocale, string>;
