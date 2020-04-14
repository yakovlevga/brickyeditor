import { bre } from '@/types/bre';

export const defaultOptions: Partial<bre.EditorOptions> = {
  locale: 'en',
  templatesUrl: 'templates/bootstrap4.html',
  compactTools: false,
  compactToolsWidth: 768,
  ignoreHtml: true,

  templateSelector: {
    zoom: true,
  },
};
