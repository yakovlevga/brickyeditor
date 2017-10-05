namespace BrickyEditor {
    export class Block {        
        public fields: Array<Fields.BaseField> = [];   
        public ui: BlockUI;

        constructor(
            public editor: Editor,
            public template: Template, 
            data?: Array<Fields.BaseField>) {

            // Get block jquery element from passed template.
            var $block = template.$html.clone();

            // Build block UI
            this.ui = new BlockUI(this, $block, data);    
        }

        public delete() {
            this.ui.delete();
            this.editor.deleteBlock(this);            
        }

        public move(offset: number) {  
            this.editor.moveBlock(this, offset);
        }

        public copy() {
            this.editor.copyBlock(this);
        }

        public insert(idx?: number) {
            var editor = this.editor;

            idx = idx || editor.blocks.length;                        
            if(editor.selectedBlock) {
                idx = editor.selectedBlockIndex + 1;
            }

            editor.blocks.splice(idx, 0, this);
            if(idx == 0) {
                editor.$editor.append(this.ui.$editor);
            }
            else {
                editor.blocks[idx - 1].ui.$editor.after(this.ui.$editor);
            }
        }

        public getData(): any {
            let fieldsData = [];
            this.fields.forEach(field => {
                fieldsData.push(field.data);
            });

            let data = { template: this.template.name, fields: fieldsData };
            if(!this.editor.options.ignoreHtml) {
                data['html'] = this.getHtml(true);
            }
            
            return data;
        }

        public getHtml(trim: Boolean, skipAttrRemoving: Boolean = false): string {        
            let $html = this.ui.$block.clone(false, false)
                .wrap('<div></div>')
                .parent();

            ['contenteditable', 'data-bre-field'].forEach((attr) => {
                $(`[${attr}]`, $html).each((idx, el) => {
                    el.removeAttribute(attr);
                });
            });

            return trim ? $html.html().breTotalTrim() : $html.html();
        }

        public select() {
            this.ui.$editor.addClass("bre-selected");

            this.editor.selectBlock(this);
        }

        public deselect() {            
            this.ui.$editor.removeClass("bre-selected");
            UI.toggleBtnDeck(this.ui.$tools, true);
            
            this.editor.deselectBlock(this);            
        }

        public scrollTo() {
            var top = this.ui.$editor.offset().top - 100;
            top = top > 0 ? top : 0;
            $('html, body').animate({
                scrollTop: top
            }, 'fast');
        }
    }
}