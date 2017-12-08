/// <reference path="types/jquery.d.ts" />
/// <reference path="types/common.d.ts" />import { debug } from "util";



namespace BrickyEditor {
    export class Editor {
        private isLoaded: boolean;

        public $editor: JQuery
        public static UI: UI;        
        public options: EditorOptions;
        public blocks: Array<Block> = [];
        public selectedBlock: Block;
        public get selectedBlockIndex() {
            if (this.selectedBlock) {
                return this.blocks.indexOf(this.selectedBlock);
            }
            return -1;
        }

        private compactTools?: boolean = null;

        constructor(
            $editor: JQuery,
            options: EditorOptions) {
            Fields.BaseField.registerCommonFields();

            this.$editor = $editor;
            this.$editor.addClass('bre-editor');            
            this.options = new EditorOptions(options);

            Editor.UI = new UI(this);
        }

        public async initAsync() {
            /// Load templates
            Editor.UI.toggleToolsLoader(true);

            const templates = await Services.TemplateService.loadTemplatesAsync(this);    
            Editor.UI.toggleToolsLoader(false);
            Editor.UI.setTemplates(templates);

            // Load initial blocks
            const blocks = await this.tryLoadInitialBlocksAsync();
            this.loadBlocks(blocks)
            
            // Trigger jQuery event
            this.isLoaded = true;
            this.trigger(Events.onLoad, this);
        }

        // load initial blocks
        private async tryLoadInitialBlocksAsync(): Promise<Block[]> {
            const url = this.options.blocksUrl;
            return new Promise<Block[]>(async (resolve, reject) => {
                if(url) {
                    try {
                        const blocks = await $.get(url);
                        resolve(blocks);
                    } catch (error) {
                        console.log('Blocks file not found.');
                        reject(error);
                    }
                }
                else if(this.options.blocks) {
                    resolve(this.options.blocks);
                }
                else {
                    resolve(null);
                }
            });
        }

        tryBindFormSubmit() {
            const editor = this;
            const $form = this.options.formSelector ? $(this.options.formSelector) : null;
            const $input = this.options.inputSelector ? $(this.options.inputSelector) : null;

            if (!$form || !$input || $form.length == 0 || $input.length == 0)
                return;

            $form.on('submit', () => {
                $input.val(JSON.stringify(editor.getData()));
                return true;
            });
        }

        bindFormSubmit() {
            const editor = this;
            const $form = this.options.formSelector ? $(this.options.formSelector) : null;
            const $input = this.options.inputSelector ? $(this.options.inputSelector) : null;

            if(!$form || !$input || $form.length == 0 || $input.length == 0)
                return;

            $form.on('submit', () => {
                $input.val(JSON.stringify(editor.getData()));
                return true;
            });
        }

        public getData(): any {
            var blocksData = [];
            this.blocks.forEach(block => {
                blocksData.push(block.getData(this.options.ignoreHtml));
            });
            return blocksData;
        }

        public getHtml(): string {
            var blocksData = [];
            this.blocks.forEach(block => {
                blocksData.push(block.getHtml(true));
            });
            return blocksData.join('\n');
        }

        /// BLOCKS
        public loadBlocks(blocks: Array<any>) {
            if (blocks && blocks.length) {
                blocks.forEach(block => {
                    let template = Services.TemplateService.getTemplate(block.template);
                    if (template) {
                        this.addBlock(template, block.fields, null, false);
                    }
                    else {
                        console.log(`Template ${block.template} not found.`);
                    }
                });
            }
        }

        public addBlock(
            template: Template,
            data?: Array<Fields.BaseField>,
            idx?: number,
            select: boolean = true) {

            let block = new Block(
                template, 
                false, 
                data,
                block => this.deleteBlock(block),
                block => this.selectBlock(block),
                block => this.deselectBlock(block),
                block => this.copyBlock(block),
                (block, offset) => this.moveBlock(block, offset));

            this.insertBlock(block, idx);

            if (select) {
                block.select();
                block.scrollTo();
            }
        }

        private insertBlock(block: Block, idx?: number) {
            idx = idx || this.blocks.length;
            if (this.selectedBlock) {
                idx = this.selectedBlockIndex + 1;
            }

            this.blocks.splice(idx, 0, block);
            if (idx == 0) {  // todo: move to block ui
                this.$editor.append(block.ui.$editor);
            }
            else { // todo: move to block ui
                this.blocks[idx - 1].ui.$editor.after(block.ui.$editor);
            }

            // Trigger jQuery event
            if(this.isLoaded) {
                this.trigger(Events.onBlockAdd, { block: block, idx: idx});
                this.trigger(Events.onChange, { blocks: this.getData(), html: this.getHtml() });
            }
        }

        private deleteBlock(block: Block) {
            const idx = this.blocks.indexOf(block);
            this.blocks.splice(idx, 1);
            block = null;

            if (idx < this.blocks.length) {
                this.blocks[idx].select();
            }
            else if (this.blocks.length > 0) {
                this.blocks[idx - 1].select();
            }
            else {
                this.selectedBlock = null;
            }

            // Trigger jQuery event
            this.trigger(Events.onBlockDelete, { block: block, idx: idx});
            this.trigger(Events.onChange, { blocks: this.getData(), html: this.getHtml() });
        }

        private moveBlock(block: Block, offset: number) {
            const idx = this.blocks.indexOf(block);
            const new_idx = idx + offset;

            if (new_idx >= this.blocks.length || new_idx < 0)
                return;

            var $anchorBlock = this.blocks[new_idx].ui.$editor;
            if (offset > 0) {
                $anchorBlock.after(block.ui.$editor);
            }
            else if (offset < 0) {
                $anchorBlock.before(block.ui.$editor);
            }

            this.blocks.splice(idx, 1);
            this.blocks.splice(new_idx, 0, block);

            // Trigger jQuery event
            this.trigger(Events.onBlockMove, { block: block, from: idx, to: new_idx });
            this.trigger(Events.onChange, { blocks: this.getData(), html: this.getHtml() });

            // Scroll to block
            block.scrollTo();
        }

        private copyBlock(block: Block) {
            const idx = this.blocks.indexOf(block) + 1;
            const copy = this.addBlock(block.template, block.getData().fields, idx, true);
        }

        private selectBlock(block: Block) {
            if (this.selectedBlock === block)
                return;

            if (this.selectedBlock) {
                this.selectedBlock.deselect();
            }

            this.selectedBlock = block;

            // Trigger jQuery event
            this.trigger(Events.onBlockSelect, { block: block });
        }

        private deselectBlock(block: Block) {
            this.selectedBlock = null;

            // Trigger jQuery event
            this.trigger(Events.onBlockDeselect, { block: block });
        }

        private trigger(event: string, data: any) {
            this.$editor.trigger('bre.' + event, data);
            Common.propsEach(this.options, (key, value) => {
                if(key.breEqualsInvariant(event)) {
                    value(data);
                }
            });
        }
    }
}