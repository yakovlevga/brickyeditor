import { $dom } from "src/common/DOMHelpers";

export class SelectionUtils {
  public static bindTextSelection(
    $el: HTMLElement,
    handler: (rect: ClientRect | null) => any
  ) {
    if (!$dom.matches($el, "[contenteditable]")) {
      return;
    }

    $dom.on($el, "mouseup", () => {
      setTimeout(() => {
        const rect = this.getSelectionRect();
        handler(rect);
      }, 0);
    });

    $dom.on($el, "keyup", () => {
      const rect = this.getSelectionRect();
      handler(rect);
    });
  }

  private static getSelectionRect() {
    const selection = window.getSelection();
    if (selection === null) {
      return null;
    }

    const range = selection.getRangeAt(0);
    return range.getBoundingClientRect();
  }
}
