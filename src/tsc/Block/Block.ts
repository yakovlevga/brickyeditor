namespace BrickyEditor {
    export class Block {
        public fields: Array<Fields.BaseField> = [];
        public ui: BlockUI;

        constructor(
            public template: Template,
            preview: boolean,
            data?: Array<Fields.BaseField>,
            private onDelete?: (block: Block) => void,
            private onSelect?: (block: Block) => void,
            private onDeselect?: (block: Block) => void,
            private onCopy?: (block: Block) => void,
            private onMove?: (block: Block, offset: number) => void,
            private onUpdate?: (block: Block, property: string, oldValue: any, newValue: any) => void) {

            this.template = template;

            const block = this;
            const $block = template.$html.clone();

            block.bindFields($block, data);

            const actions = this.getActions();

            // Build block UI
            this.ui = new BlockUI($block, preview, actions, () => this.select());
        }

        /**
         * Finds and binds block fields
         *
         * @param data Array of block fields data
         */
        private bindFields($block: JQuery, data?: Array<Fields.BaseField>) {
            const block = this;
            const $fields = $block
                .find(Selectors.selectorField)
                .addBack(Selectors.selectorField);

            $fields.each((idx, elem) => {
                const onUpdate = (property: string, oldValue: any, newValue: any) => {
                    if(this.onUpdate) {
                        this.onUpdate(block, property, oldValue, newValue);
                    }
                };
                let $field = $(elem);                
                let field = Fields.BaseField.createField($field, data, () => block.select(), onUpdate);
                this.fields.push(field);
            });
        }

        private getActions() : BlockUIAction[] {
            const block = this;
            let actions = [
                new BlockUIAction('ellipsis-h'),
                new BlockUIAction('trash-o', () => block.delete()),
                new BlockUIAction('copy', () => block.clone()),
                new BlockUIAction('angle-up', () => block.move(-1)),
                new BlockUIAction('angle-down', () => block.move(1))
            ]
            return actions;
        }

        public delete() {
            this.ui.delete();
            this.onDelete(this);
        }

        public move(offset: number) {
            this.onMove(this, offset);
        }

        public clone() {
            this.onCopy(this);
        }

        public select() {
            this.ui.toggleSelection(true);
            this.onSelect(this);
        }

        public deselect() {
            this.ui.toggleSelection(false);
            this.onDeselect(this);
        }

        public scrollTo() {
            // todo: move to block ui
            var top = this.ui.$editor.offset().top - 100;
            top = top > 0 ? top : 0;
            $('html, body').animate({
                scrollTop: top
            }, 'fast');
        }

        public getData(ignoreHtml?: Boolean): any {
            let fieldsData = [];
            this.fields.forEach(field => {
                fieldsData.push(field.data);
            });

            let data = { template: this.template.name, fields: fieldsData };
            if (!ignoreHtml) {
                data['html'] = this.getHtml(true);
            }

            return data;
        }

        public getHtml(trim: Boolean, skipAttrRemoving: Boolean = false): string {
            let $html = this.ui.$block.clone(false, false)
                .wrap('<div></div>')
                .parent();

            // Firefox execCommand hack
            $('.bre-temp-container', $html).each((idx, el) => {
                let $el = $(el);
                $el.replaceWith($el.children());
            });

            ['contenteditable', 'data-bre-field'].forEach((attr) => {
                $(`[${attr}]`, $html).each((idx, el) => {
                    el.removeAttribute(attr);
                });
            });            

            return trim ? $html.html().breTotalTrim() : $html.html();
        }
    }
}