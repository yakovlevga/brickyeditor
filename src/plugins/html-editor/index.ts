import { bre } from "@/types/bre";
import { initHtmlTools, toggleHtmlTools, bindTextSelection } from "./htmlTools";

import style from "./style.scss";

type HtmlToolsButtonCommands =
  | "Bold"
  | "Italic"
  | "CreateLink"
  | "insertOrderedList"
  | "insertUnorderedList"
  | "Undo"
  | "Redo";

export type HtmlToolsButton = {
  icon: string;
  command: HtmlToolsButtonCommands;
  range: boolean;
  aValueArgument?: string;
};

export type HtmlToolsOptions = {
  buttons?: HtmlToolsButton[];
};

const defaultOptions: Required<HtmlToolsOptions> = {
  buttons: [
    { icon: "bold", command: "Bold", range: true },
    { icon: "italic", command: "Italic", range: true },
    { icon: "link", command: "CreateLink", range: true },
    {
      icon: "list-ul",
      command: "insertUnorderedList",
      range: true,
    },
    {
      icon: "list-ol",
      command: "insertOrderedList",
      range: true,
    },
    { icon: "undo", command: "Undo", range: false },
    { icon: "repeat", command: "Redo", range: false },
  ],
};

export const plugin = {
  init: (editor: bre.Editor, options: HtmlToolsOptions) => {
    const $control = initHtmlTools(
      editor.shared.messages,
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

    editor.on("fieldCreate", ({ sender: field }) => {
      if (field.data.type === "html") {
        bindTextSelection(field.$element, onSelect);
      }
    });
  },
};
