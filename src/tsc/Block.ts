/// <reference path="types/jquery.d.ts" />

namespace BrickyEditor {
    export class Block {        
        public template: string;
        public fields: Array<Fields.BaseField> = [];        

        public editor: Editor;
        public $editor: JQuery; // block editor
        public $tools: JQuery; // block editor tools

        constructor(editor: Editor, templateName: string, data?: Array<Fields.BaseField>) {
            let block = this;
            this.editor = editor;
            this.template = templateName;
            let template = TemplateService.getTemplate(templateName);

            let $editor = $(template.html);
            this.$editor = $editor;

            this.bindEditorFields(data);
        }

        private showControls($blockEditor: JQuery) {
            
        }

        private bindEditorFields(data?: Array<Fields.BaseField>) {
            let block = this;

            this.$editor
                .find(Constants.selectorField)
                .addBack(Constants.selectorField)
                .each(function() {
                    let $field = $(this);

                    let fieldName = TemplateService.getFieldValue($field, "name");
                    let fieldData: Fields.BaseField;
                    if(data) {
                        data.forEach(fd => {
                            if(fd.name === fieldName) {
                                fieldData = fd.data;
                            }
                        });
                    }
                    
                    let field = Fields.BaseField.getField(block, $field, fieldData);
                    if(field) {
                        block.fields.push(field);
                    }
                });
        }

        public getData(): any {
            var fieldsData = [];
            this.fields.forEach(field => {
                fieldsData.push(field.getData());
            });

            return {
                template: this.template,
                html: this.getHtml(true),
                fields: fieldsData
            };
        }

        public getHtml(trim: Boolean): string {            
            let $html = this.$editor.clone();
            $html
                .find(Constants.selectorField)
                .addBack(Constants.selectorField)
                .each(function(idx, el) {
                    
                    // Find attributes names, that we should remove before rendering. 
                    // It's special attributes, that brickyeditor use in service purposes.
                    let attrsToRemove = Common.propsFilterKeys(el.attributes, (k, v) => {
                        return v.name.breStartsWith(Constants.field);
                    }).map(attr => {
                        return el.attributes[attr].name;
                    });
                    // Also, remove contenteditable attribute.
                    attrsToRemove.push('contenteditable');

                    attrsToRemove.forEach(attr => {
                        el.removeAttribute(attr);
                    });  
                });

            var html = $html[0].outerHTML;
            return trim ? html.breTotalTrim() : html;
        }
    }
}