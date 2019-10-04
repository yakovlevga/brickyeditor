import { $dom } from "src/Common/DOMHelpers";

export class SelectionUtils {
    public static bindTextSelection($el: HTMLElement, handler: (rect: ClientRect) => any) {
        if (!$dom.matches($el, '[contenteditable]')) {
            return;
        }

        $dom.on($el, 'mouseup', () => {
            setTimeout(() => {
                let rect = this.getSelectionRect();
                handler(rect);
            }, 0);
        });

        $dom.on($el, 'keyup', (ev) => {
            let rect = this.getSelectionRect();
            handler(rect);
        });
    }

    private static getSelectionRect(): ClientRect {
        let selection = window.getSelection();
        let range = selection.getRangeAt(0);
        if (range) {
            let rect = range.getBoundingClientRect();
            if (rect) {
                return rect;
            }
        }

        return null;
    }
}