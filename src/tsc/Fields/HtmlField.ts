namespace BrickyEditor {
    export namespace Fields {
        export class HtmlField extends BaseField {

            bind() {
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
            }

        }
    }
}