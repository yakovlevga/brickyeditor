/// <reference path="types/jquery.d.ts" />

namespace BrickyEditor {
    export class Block {        
        public template: string;
        public fields: Array<Fields.BaseField> = [];        

        public editor: Editor;
        public $editor: JQuery; // block editor
        public $block: JQuery; // block content
        public $tools: JQuery; // block editor tools

        constructor(editor: Editor, templateName: string, data?: Array<Fields.BaseField>) {
            let block = this;
            this.editor = editor;
            this.template = templateName;

            let template = TemplateService.getTemplate(templateName);
            
            
            this.$block = $(template.html);
            this.$editor = this.getBlockTools(this.$block);

            this.bindBlockFields(data);
        }

        private getBlockTools($block : JQuery) : JQuery {
            let block = this;
            let $tools = $(
                `<div class='brickyeditor-block-wrapper'>
                    <div  class='brickyeditor-block-tools'>
                        <a class='fa fa-trash-o' data-brickyeditor-block-action='${BlockAction.Delete}'></a>
                        <a class='fa fa-copy' data-brickyeditor-block-action='${BlockAction.Copy}'></a>
                        <a class='fa fa-angle-up' data-brickyeditor-block-action='${BlockAction.Up}'></a>
                        <a class='fa fa-angle-down' data-brickyeditor-block-action='${BlockAction.Down}'></a>
                    </div>
                </div>`
            );
            $('[data-brickyeditor-block-action]', $tools).on('click', function() {
                let action = $(this).attr('data-brickyeditor-block-action');                
                block.action(parseInt(action));
            });
            $tools.append($block);
            return $tools;
        }

        private action(action: number) {
            switch (action) {
                case BlockAction.Delete:
                    this.editor.deleteBlock(this);
                    break;
                case BlockAction.Up:
                    this.editor.moveBlock(this, -1);
                    break;
                case BlockAction.Down:
                    this.editor.moveBlock(this, +1);
                    break;
                case BlockAction.Copy:
                    this.editor.copyBlock(this);
                    break;
                default:
                    break;
            }
        }

        private bindBlockFields(data?: Array<Fields.BaseField>) {
            let block = this;

            this.$block
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
            let $html = this.$block.clone();
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

    enum BlockAction {
        Delete,
        Settings,
        Copy,
        Up,
        Down
    };
}