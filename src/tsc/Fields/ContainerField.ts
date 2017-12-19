namespace BrickyEditor {
    export namespace Fields {
        export class ContainerField extends BaseField {

            public container: BlocksContainer;
            private $placeholder: JQuery;

            bind() {
                let field = this;
                let $field = this.$field;

                this.container = new BlocksContainer($field,
                    (block: Block) => { 
                        field.updateBlocks(); 
                    },
                    (block: Block) => { field.updateBlocks(); },
                    (block: Block) => { this.select(); },
                    (block: Block) => { },
                    (block: Block) => { field.updateBlocks(); },
                    (block: Block) => { field.updateBlocks(); },
                    true);

                $field.addClass(Selectors.selectorFieldContainer);
                $field
                    .on('click', (ev) => {                        
                        field.select();
                        ev.stopPropagation();
                        return false;
                    });
            }

            updateBlocks() {
                this.updateProperty('blocks', this.container.getData(true), true);
                this.updateProperty('html', this.container.getHtml(), true);
            }

            public deselect() {
                this.container.blocks.forEach(b => b.deselect());
                this.$field.removeClass(Selectors.selectorFieldSelected);
            }

            public getEl(): JQuery {
                let html = this.container.getHtml();
                return $(html);
            }
        }
    }
}