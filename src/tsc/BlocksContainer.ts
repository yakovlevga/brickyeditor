namespace BrickyEditor {
    export class BlocksContainer {

        public blocks: Array<Block> = [];
        public selectedBlock: Block;
        public isContainer: boolean = true;
        public $placeholder: JQuery;

        constructor(
            private $element: JQuery,
            private onAddBlock: (block: Block, idx: number) => any,
            private onDeleteBlock: (block: Block, idx: number) => any,
            private onSelectBlock: (block: Block) => any,
            private onDeselectBlock: (block: Block) => any,
            private onMoveBlock: (block: Block, from: number, to: number) => any,
            private onUpdateBlock: (block: Block, property: string, oldValue: any, newValue: any) => any,
            private usePlaceholder: boolean = false) {

            this.togglePlaceholderIfNeed();
        }

        public getData(ignoreHtml?: Boolean): any {
            var blocksData = [];
            this.blocks.forEach(block => {
                blocksData.push(block.getData(ignoreHtml));
            });
            return blocksData;
        }

        public getHtml(): string {
            var blocksHtml = [];
            this.blocks.forEach(block => {
                blocksHtml.push(block.getHtml(true));
            });

            var blocksHtmlJoined = blocksHtml.join('\n');
            let $el = this.$element.clone(false, false).html(blocksHtmlJoined).wrap('<div></div>');
            const html = $('<div></div>').append($el).html();
            return html;
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
                (block, offset) => this.moveBlock(block, offset),
                this.onUpdateBlock);

            this.insertBlock(block, idx);

            if (select) {
                block.select();
                block.scrollTo();
            }
        }

        private insertBlock(block: Block, idx?: number) {
            idx = idx || this.blocks.length;
            if (this.selectedBlock) {
                idx = this.blocks.indexOf(this.selectedBlock) + 1;
            }

            this.blocks.splice(idx, 0, block);
            if (idx == 0) {  // todo: move to block ui
                this.$element.append(block.ui.$editor);
            }
            else { // todo: move to block ui
                this.blocks[idx - 1].ui.$editor.after(block.ui.$editor);
            }

            this.onAddBlock(block, idx);
            block.select(null);

            this.togglePlaceholderIfNeed();
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

            // Trigger event
            this.onDeleteBlock(block, idx);

            this.togglePlaceholderIfNeed();
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

            this.onMoveBlock(block, idx, new_idx);

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
            this.onSelectBlock(block);
        }

        private deselectBlock(block: Block) {
            this.selectedBlock = null;
            this.onDeselectBlock(block);
        }

        private togglePlaceholderIfNeed() {
            if(!this.usePlaceholder) {
                return;
            }

            if(this.blocks.length === 0) {
                if(!this.$placeholder) {
                    this.$placeholder = $('<i data-bre-placeholder="true">Click here to select this container...</i>');
                    this.$element.append(this.$placeholder);
                }
            }
            else if (this.$placeholder) {
                this.$placeholder.remove();
                this.$placeholder = null;
            }
        }
    }
}