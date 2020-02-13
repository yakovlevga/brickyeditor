import { bre } from "@/types/bre";

const defaultButtons: bre.HtmlToolsButton[] = [
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
];

export const defaultOptions: bre.EditorOptions = {
  templatesUrl: "templates/bootstrap4.html",
  compactTools: false,
  compactToolsWidth: 768,
  ignoreHtml: true,
  htmlToolsButtons: defaultButtons
};
