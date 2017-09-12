/// <reference path="types/jquery.d.ts" />
/// <reference path="types/common.d.ts" />

namespace BrickyEditor {
    export class Editor {
        public ui: UI;
        public blocks: Array<Block> = [];
        public selectedBlock: Block;
        public get selectedBlockIndex() {
            if(this.selectedBlock) {
                return this.blocks.indexOf(this.selectedBlock);
            }
            return -1;
        }
        
        private compactTools? : boolean = null;

        constructor(
            public $editor: JQuery, 
            public options: EditorOptions) {
            
            $editor.addClass('bre-editor');

            Fields.BaseField.registerCommonFields();
            
            this.options = new EditorOptions(options);
            this.ui = new UI(this);

            /// Load templates
            this.ui.toggleToolsLoader(true);
            Services
                .TemplateService
                .loadTemplatesAsync(this)
                .done(templates => {

                    this.ui.toggleToolsLoader(false);
                    this.ui.setTemplates(templates);

                    // Load blocks into container
                    if(this.options.blocks && this.options.blocks.length) {                
                        this.loadBlocks(this.options.blocks);
                    }

                    // Call onload handler if exists
                    if(this.options.onload) {
                        this.options.onload(this);
                    }
                });

            //todo: future feature
            //this.setupHotkeys();
        }

        // todo: move to constants
        // keyUp: number = 38;
        // keyDown: number = 40;
        // keyDelete: number = 46;
        // keyBackspace: number = 8;

        // private setupHotkeys() {
        //     document.onkeydown = (ev: KeyboardEvent) => {         
        //         if((ev.metaKey || ev.ctrlKey) && this.selectedBlock) {
        //             let prevent = false;
        //             if(ev.keyCode === this.keyUp) {
        //                 this.moveBlock(this.selectedBlock, -1);
        //                 prevent = true;
        //             }
        //             else if(ev.keyCode === this.keyDown) {
        //                 this.moveBlock(this.selectedBlock, 1);
        //                 prevent = true;
        //             }
        //             else if(ev.keyCode === this.keyDelete ||
        //                 ev.keyCode === this.keyBackspace) {
        //                 this.deleteBlock(this.selectedBlock);
        //             }

        //             if(prevent) {
        //                 ev.preventDefault();
        //                 return false;
        //             }
        //         }
        //     };
        // }

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

        public loadBlocks(blocks: Array<any>) {
            if(blocks && blocks.length) {
                blocks.forEach(block => {
                    let template = Services.TemplateService.getTemplate(block.template);
                    if(template) {
                        this.addBlock(template, block.fields, null, false);
                    }
                    else {
                        console.log(`Template ${block.template} not found.`);
                    }
                });
            }
        }

        public selectBlock(block: Block) {
            if(this.selectedBlock === block)
                return;

            if(this.selectedBlock) {
                this.selectedBlock.deselect();
            }

            this.selectedBlock = block;
        }

        public deselectBlock(block: Block) {
            this.selectedBlock = null;            
        }

        public addBlock(
            template: Template, 
            data? : Array<Fields.BaseField>, 
            idx? : number, 
            select: boolean = true) {

            let block = new Block(this, template, data);
            block.insert(idx);

            if(select) {
                block.select();
                block.scrollTo();
            }
        }

        public deleteBlock(block: Block) {
            let idx = this.blocks.indexOf(block);
            this.blocks.splice(idx, 1);
            block = null;
            
            if(idx < this.blocks.length) {
                this.blocks[idx].select();
            }
            else if (this.blocks.length > 0) {
                this.blocks[idx - 1].select();
            }
            else {
                this.selectedBlock = null;
            }
        }

        public moveBlock(block: Block, offset: number) {
            let idx = this.blocks.indexOf(block);
            let new_idx = idx + offset;

            if (new_idx >= this.blocks.length || new_idx < 0)
                return;

            var $anchorBlock = this.blocks[new_idx].ui.$editor;
            if(offset > 0) {
                $anchorBlock.after(block.ui.$editor);
            }
            else if (offset < 0) {
                $anchorBlock.before(block.ui.$editor);
            }

            this.blocks.splice(idx, 1);
            this.blocks.splice(new_idx, 0, block);

            block.scrollTo();
        }

        public copyBlock(block: Block) {
            let idx = this.blocks.indexOf(block) + 1;
            let copy = this.addBlock(block.template, block.getData().fields, idx, true);
        }
    }
}