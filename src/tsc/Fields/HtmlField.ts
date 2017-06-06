namespace BrickyEditor {
    export namespace Fields {
        export class HtmlField extends BaseField {

            bind() {
                let field = this;
                let $field = this.$field;
                let data = this.data;

                if(!$field.is('[contenteditable]')) {
                    $field.attr('contenteditable', 'true');
                }                

                this.data.html = 
                    this.data.html || 
                    TemplateService.getFieldValue($field, 'html') ||
                    Constants.dummyText;

                $field.html(this.data.html);
                this.$field.on('blur keyup paste input', function() { 
                    data.html = $(this).html().trim();
                });

                // this.$field.on('selectionchange', () => {
                //     let selectedText = Common.getSelectedText();
                //     console.log(selectedText);
                //     console.log(selectedText.length);
                //     if(selectedText.length > 0) {
                //         field.block.editor.htmlTools.$control.show();
                //     }
                //     else {
                //         field.block.editor.htmlTools.$control.hide();
                //     }
                // });         

                this.$field.on('paste', (e) => {

                    let ev = e.originalEvent as any;                    
                    let text = ev.clipboardData.getData('text/html');
                    if(text) {
                        let $temp = $("<div></div>");
                        let $text = $(text);
                        $text.removeAttr("style");                        
                        $temp.append($text);
                        ev.clipboardData.setData('text/html', $temp.html());
                    }
                });
            }
        }
    }
}