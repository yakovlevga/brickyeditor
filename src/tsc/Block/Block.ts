namespace BrickyEditor {
    export class Block {
        public fields: Array<Fields.BaseField> = [];
        public ui: BlockUI;
        public selectedField: Fields.BaseField;

        constructor(
            public template: Template,
            preview: boolean,
            data?: Array<Fields.BaseField>,
            private onDelete?: (block: Block) => void,
            private onSelect?: (block: Block) => void,
            private onDeselect?: (block: Block) => void,
            private onCopy?: (block: Block) => void,
            private onMove?: (block: Block, offset: number) => void,
            private onUpdate?: (block: Block, property: string, oldValue: any, newValue: any) => void,
            private onUpload?: (file: any, callback: (url: string) => void) => void) {

            this.template = template;

            const block = this;
            const $block = template.$html.clone();

            block.bindFields($block, data);

            const actions = this.getActions();

            // Build block UI
            this.ui = new BlockUI($block, preview, actions, () => this.select());
        }

        public isContainer() : boolean {
            if(!this.selectedField)
                return false;

            return this.selectedField instanceof Fields.ContainerField;
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
                    if(block.onUpdate) {
                        block.onUpdate(block, property, oldValue, newValue);
                    }
                };
                const onSelect = (field: Fields.BaseField) => {
                    block.select(field);
                };
                let $field = $(elem);
                let field = Fields.BaseField.createField($field, data, onSelect, onUpdate, block.onUpload);
                block.fields.push(field);
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

        public select(field?: Fields.BaseField) {
            if(field === this.selectedField)
                return;
                
            if(field === null) {
                field = this.fields[0];
            }

            if(this.selectedField) {
                this.selectedField.deselect();
            }

            this.selectedField = field;
            this.ui.toggleSelection(true);
            this.onSelect(this);
        }

        public deselect() {
            this.selectedField = null;
            this.fields.forEach(f => {
                f.deselect()
            });
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

        public getHtml(trim: Boolean): string {
            let $html = this.template.$html.clone(false, false)
                .wrap('<div></div>')
                .parent();

            let fieldsHtml = {};
            this.fields.forEach(field => {
                const name = field.name || field.data.name;
                fieldsHtml[name] = field.getEl();
            });    

            $html
                .find(Selectors.selectorField)
                .addBack(Selectors.selectorField)
                .each((idx, elem) => {
                    let fieldData = $(elem).data().breField;
                    if(typeof fieldData === 'string') {
                        fieldData = JSON.parse(fieldData.replace(/'/g, '"'));
                    }
                    const name = fieldData.name;
                    const $field = fieldsHtml[name];
                    $(elem).replaceWith($field);
                });
                
            const html = $html.html();
            if(!html) {
                return null;
            }

            return trim ? html.breTotalTrim() : html;
        }
    }
}