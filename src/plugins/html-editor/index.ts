import { bre } from '@/types/bre';
import { initHtmlTools, toggleHtmlTools, bindTextSelection } from './htmlTools';

import { iconBold } from './icons/iconBold';
import { iconItalic } from './icons/iconItalic';
import { iconLink } from '@/../plugins/html-editor/icons/iconLink';
import { iconList } from '@/../plugins/html-editor/icons/iconList';
import { iconUndo } from '@/../plugins/html-editor/icons/iconUndo';
import { iconRepeat } from '@/../plugins/html-editor/icons/iconRepeat';

type HtmlToolsButtonCommands =
  | 'Bold'
  | 'Italic'
  | 'CreateLink'
  | 'insertOrderedList'
  | 'insertUnorderedList'
  | 'Undo'
  | 'Redo';

export type HtmlToolsButton = {
  icon: string;
  command: HtmlToolsButtonCommands;
  range: boolean;
};

export type HtmlToolsOptions = {
  buttons?: HtmlToolsButton[];
};

const defaultOptions: Required<HtmlToolsOptions> = {
  buttons: [
    { icon: iconBold, command: 'Bold', range: true },
    { icon: iconItalic, command: 'Italic', range: true },
    { icon: iconLink, command: 'CreateLink', range: true },
    {
      icon: iconList,
      command: 'insertUnorderedList',
      range: true,
    },
    {
      icon: iconList,
      command: 'insertOrderedList',
      range: true,
    },
    { icon: iconUndo, command: 'Undo', range: false },
    { icon: iconRepeat, command: 'Redo', range: false },
  ],
};

export const plugin = {
  init: (editor: bre.Editor, options: HtmlToolsOptions) => {
    const $control = initHtmlTools(
      editor.shared.modal,
      editor.shared.helpers,
      defaultOptions.buttons
    );

    if ($control === null) {
      return;
    }

    const onSelect = (rect: ClientRect | null) => {
      toggleHtmlTools($control, rect, editor.shared.helpers);
    };

    editor.on('fieldCreate', ({ sender: field }) => {
      if (field.data.type === 'html') {
        bindTextSelection(field.$element, onSelect);
      }
    });
  },
};
