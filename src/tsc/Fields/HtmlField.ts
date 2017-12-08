namespace BrickyEditor {
    export namespace Fields {
        export class HtmlField extends BaseField {

            bind() {
                let field = this;
                let $field = this.$field;

                if (!$field.is('[contenteditable]')) {
                    $field.attr('contenteditable', 'true');
                }

                var html = this.data.html || this.$field.html();
                this.setHtml(html, false);

                $field.html(this.data.html);

                SelectionUtils.bindTextSelection($field, (rect) => {
                    Editor.UI.htmlTools.show(rect);
                });

                $field
                    .on('blur keyup paste input', () => {
                        this.setHtml($field.html());
                    })
                    .on('paste', (e) => {
                        e.preventDefault();
                        let ev = e.originalEvent as any;
                        let text = ev.clipboardData.getData('text/plain');
                        document.execCommand("insertHTML", false, text);
                    })
                    .on('click', (ev) => {
                        // Prevents the event from bubbling up the DOM tree
                        field.selectBlock();
                        ev.stopPropagation();
                        return false;
                    });
            }

            setHtml(value: string, fireUpdate: boolean = true) {
                value = value.trim();
                if (this.$field.html() !== value) {
                    this.$field.html(value);
                }
                this.updateProperty('html', value, fireUpdate);
            }
        }
    }
}