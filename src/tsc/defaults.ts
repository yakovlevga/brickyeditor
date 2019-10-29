import { bre } from "src/Types/bre";

const defaultButtons: bre.IHtmlToolsButton[] = [
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
];

export const defaultOptions: Partial<bre.Options> = {
  templatesUrl: "templates/bootstrap4.html",
  compactTools: false,
  compactToolsWidth: 768,
  ignoreHtml: true,
  onError: (data: any) => {
    // tslint:disable-next-line:no-console
    console.log(data.message);
  },
  htmlToolsButtons: defaultButtons,
};
