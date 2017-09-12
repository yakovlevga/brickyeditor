namespace BrickyEditor {
    export class SelectionHelper {
        static getSelectedText() : string {            
            let sel = window.getSelection();
            return sel.getRangeAt(0).toString();
        }

        static replaceSelectedText(replacement) {
            var sel, range;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(replacement));
                }
            }
        }
    }
}