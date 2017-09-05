namespace BrickyEditor {
    export namespace Fields {
        export class ContainerField extends BaseField {
            public container: Container;

            private _data: any;
            public get data() : any {
                return this.container ? this.container.getData() : {};
            }
            public set data(v : any) {
                this._data = v;
            }       

            constructor(block: Block, $field: JQuery, data: any) {
                super(block, $field, data);
                this.container = new Container($field, this.block.editor);
            }            

            bind() {
                let field = this;
                let $field = this.$field;
                let data = this.data;

                $field.on('click', function() {
                    field.selectBlock(field.container);
                });
            }

            public select() {
                this.$field.addClass('selected');
            }

            public deselect() {
                this.$field.removeClass('selected');
            }
        }
    }
}