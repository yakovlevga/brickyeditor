/// <reference path="types/jquery.d.ts" />

namespace BrickyEditor {
    export class Block {        
        public template: string;
        public fields: Array<Fields.BaseField> = [];        

        public editor: Editor;
        public container: Container;
        public $editor: JQuery; // block editor
        public $block: JQuery; // block content
        public $tools: JQuery; // block editor tools

        constructor(editor: Editor, container: Container, templateName: string, data?: Array<Fields.BaseField>) {
            let block = this;
            this.editor = editor;
            this.container = container;
            this.template = templateName;

            let template = Services.TemplateService.getTemplate(templateName);
                        
            this.$block = $(template.html);
            let $editor = this.getBlockTools(this.$block);
            this.$editor = $editor;            
            
            $editor.hover(
                () => {
                    //$(".brickyeditor-block-wrapper").removeClass('active');
                    $editor.addClass('active');
                    //return false;
                },
                () => {
                    $editor.removeClass('active');
                    //return false;
                }
            );

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
                    this.container.deleteBlock(this);
                    break;
                case BlockAction.Up:
                    this.container.moveBlock(this, -1);
                    break;
                case BlockAction.Down:
                    this.container.moveBlock(this, +1);
                    break;
                case BlockAction.Copy:
                    this.container.copyBlock(this);
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
                    let fieldName = Services.TemplateService.getFieldValue($field, "name");
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

        public getHtml(trim: Boolean, skipAttrRemoving: Boolean = false): string {            
            let $html = this.$block.clone();
            $html
                .find(Constants.selectorField)
                .addBack(Constants.selectorField)
                .each(function(idx, el) {
                    
                    if(skipAttrRemoving)
                        return;
                        
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

        public selectBlock(field?: Fields.BaseField, container?: Container) {
            if(this.container.selectedBlock) {
                this.container.selectedBlock.deselectBlock();
            }
            this.container.selectedBlock = this;
            this.container.select(container);
        }

        public deselectBlock() {
            this.container.deselect(this.container.selectedContainer);
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