namespace BrickyEditor {
    export class Container {
        private editor: Editor;

        protected $el: JQuery; // jquery element of container

        public blocks: Array<Block> = [];
        public selectedBlock: Block;
        
        private _selectedContainer : Container;
        public get selectedContainer() : Container {
            return this._selectedContainer;
        }
        public set selectedContainer(v : Container) {
            if(this._selectedContainer && this._selectedContainer != v) {
                this._selectedContainer.$el.removeClass("selected");
            }

            this._selectedContainer = v;

            if(this._selectedContainer) {
                this._selectedContainer.$el.addClass("selected");
            }
        }        
        
        constructor($el: JQuery, editor?: Editor) {
            this.$el = $el;
            if(editor) {
                this.editor;
            }
            else if (this instanceof Editor) {
                this.editor = this;
            }
        }

        public select(container: Container) {
            this.selectedContainer = container;
            if(this.selectedContainer) {
                this.selectedContainer.$el.on('contextmenu', () => {
                    this.deselect(container);
                    return false;
                });
            }
        }

        public deselect(container: Container) {            
            if(container) {
                container.$el.off('contextmenu');
                container.editor.selectedContainer = null;
            }
        }

        public getData() : any {
            var blocksData = [];            
            this.blocks.forEach(block => {
                blocksData.push(block.getData());
            });
            return blocksData;
        }

        public getHtml() : string {
            var blocksData = [];
            this.blocks.forEach(block => {
                blocksData.push(block.getHtml(true));
            });
            return blocksData.join('\n');
        }

        /// BLOCKS

        public loadBlocks(blocks: Array<Block>) {
            if(blocks && blocks.length) {
                blocks.forEach(block => {
                    this.addBlock(block.template, block.fields);
                });
            }
        }

        public addBlock(template: string, data? : Array<Fields.BaseField>, idx? : number) {            
            let container: Container = this;            
            if(this.selectedBlock && this.selectedContainer) {
                container = this.selectedContainer;
            }

            let block = new Block(this.editor, container, template, data);            

            if(idx == null && container.selectedBlock != null) {
                idx = container.blocks.indexOf(container.selectedBlock) + 1;
            }

            if(idx != null) {
                container.blocks[idx - 1].$editor.after(block.$editor);
                container.blocks.splice(idx, 0, block);
                container.selectedBlock = block;                
            }
            else {
                container.$el.append(block.$editor);
                container.blocks.push(block);
            }

            container.selectedBlock = block;

            $('html, body').animate({
                scrollTop: block.$editor.offset().top
            }, 'fast');
        }

        public deleteBlock(block: Block) {
            let idx = this.blocks.indexOf(block);
            this.blocks.splice(idx, 1);
            block.$editor.remove();
            block = null;
            this.selectedBlock = null;
        }

        public moveBlock(block: Block, offset: number) {
            let idx = this.blocks.indexOf(block);
            let new_idx = idx + offset;

            if (new_idx < this.blocks.length && new_idx >= 0) {
                var $anchorBlock = this.blocks[new_idx].$editor;
                if(offset > 0) {
                    $anchorBlock.after(block.$editor);
                }
                else if (offset < 0) {
                    $anchorBlock.before(block.$editor);
                }

                this.blocks.splice(idx, 1);
                this.blocks.splice(new_idx, 0, block);
            }
        }

        public copyBlock(block: Block) {
            block.selectBlock();
            let idx = this.blocks.indexOf(block) + 1;
            this.addBlock(block.template, block.getData().fields, idx);
        }
    }
}