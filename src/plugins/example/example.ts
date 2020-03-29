import { bre } from "@/types/bre";

export const plugin = {
  init: (editor: bre.Editor) => {
    editor.on("blockAdd", ev => {});
  }
};
