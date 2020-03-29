import { bre } from "@/types/bre";
import { initHtmlTools, toggleHtmlTools } from "./htmlTools";
import { bindTextSelection } from "@/ui/selection";

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
      range: true
    },
    {
      icon: "list-ol",
      command: "insertOrderedList",
      range: true
    },
    { icon: "undo", command: "Undo", range: false },
    { icon: "repeat", command: "Redo", range: false }
  ]
};

export const plugin = {
  init: (editor: bre.Editor, options: HtmlToolsOptions) => {
    const $control = initHtmlTools(defaultOptions.buttons);

    if ($control === null) {
      return;
    }

    const onSelect: Parameters<typeof bindTextSelection>[1] = rect => {
      toggleHtmlTools($control, rect);
    };

    editor.on("fieldCreate", ({ sender: field }) => {
      if (field.data.type === "html") {
        bindTextSelection(field.$element, onSelect);
      }
    });
  }
};
