namespace BrickyEditor {
    export class SelectionUtils {

        public static bindTextSelection($el: JQuery, handler: (rect: ClientRect) => any) {
            if(!$el.is('[contenteditable]')) {
                return;
            }

            $el.on('mouseup', () => {
                setTimeout(() => {
                    let rect = this.getSelectionRect();
                    handler(rect);
                }, 0);
            });            

            $el.on('keyup', (ev) => {    
                let rect = this.getSelectionRect();
                handler(rect);
            });
        }

        private static getSelectionRect() : ClientRect {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);            
            if(range) {
                let rect = range.getBoundingClientRect();
                if(rect) {
                    return rect;
                }
            }

            return null;
        }
    }
}