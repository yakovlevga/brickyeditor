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
                    Services.TemplateService.getFieldValue($field, 'html') ||
                    Constants.dummyText;

                $field.html(this.data.html);

                $field.on('focus', () => {
                    this.selectBlock();
                });

                $field.on('blur keyup paste input', function() {
                     data.html = $(this).html().trim()
                });    

                $field.on('paste', (e) => {

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