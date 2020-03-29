import { bre } from "@/types/bre";

export const defaultOptions: bre.EditorOptions = {
  templatesUrl: "templates/bootstrap4.html",
  compactTools: false,
  compactToolsWidth: 768,
  ignoreHtml: true,

  templateSelector: {
    zoom: true
  }
};
